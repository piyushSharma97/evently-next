import { Schema, model, models } from "mongoose";
import { UserRole } from "@/lib/auth/roles";

export interface IUser {
  _id: string;
  clerkId: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'creator', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
