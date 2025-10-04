import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  status: "active" | "unverified" | "blocked";
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ["active", "unverified", "blocked"], default: "unverified" },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent model overwrite issues in dev
const UserModel = models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
