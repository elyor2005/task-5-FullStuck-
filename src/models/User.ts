import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  status: "active" | "unverified" | "blocked";
  lastLogin?: Date;
  confirmationToken?: string; // ✅ added
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ["active", "unverified", "blocked"], default: "unverified" },
    lastLogin: { type: Date, default: null },
    confirmationToken: { type: String, default: null }, // ✅ added
  },
  { timestamps: true }
);

// ✅ Safe model initialization
const UserModel: Model<IUser> = (mongoose.models && (mongoose.models.User as Model<IUser>)) || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
