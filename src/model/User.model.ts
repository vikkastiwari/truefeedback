import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;  
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

// Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

/**
 * Nextjs - Edge Time Framework
 * Nextjs doesn't know whether the app is booted first time or previously it ran
 * So to take care of that we write it conditionally if usermodel exists then export that
 * Else create one database for the same using mongoose and then export
 */
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
