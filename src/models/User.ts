// src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

/**
 * User interface and schema
 * important: email will have a unique index at DB level (see createIndexes below)
 * note: password is stored hashed
 * nota bene: do not rely on application-level uniqueness checks only
 */

export type TUser = Document & {
  name: string;
  email: string;
  passwordHash: string;
  status: "unverified" | "active" | "blocked";
  createdAt: Date;
  lastLogin?: Date | null;
  confirmationToken?: string | null;
};

const UserSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ["unverified", "active", "blocked"], default: "unverified" },
    createdAt: { type: Date, default: () => new Date() },
    lastLogin: { type: Date, default: null },
    confirmationToken: { type: String, default: null },
  },
  { timestamps: false }
);

// important: define a unique index on email on the schema
UserSchema.index({ email: 1 }, { unique: true, background: false });

// Avoid recompilation issues in dev/hot-reload
const UserModel = (mongoose.models.User as mongoose.Model<TUser>) || mongoose.model<TUser>("User", UserSchema);

// Ensure index creation on startup (important: DB-level uniqueness)
async function ensureIndexes() {
  try {
    // note: createIndexes() will create indexes on the model's collection
    await UserModel.createIndexes();
    // nota bene: createIndexes throws if index cannot be created
    // console.log("User indexes ensured");
  } catch (err) {
    // If index exists or there is an error, log it but let app continue
    // console.error("User.createIndexes() failed:", err);
  }
}
ensureIndexes();

export default UserModel;
