import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  surname: string;
  startUp?: string;
  email: string;
  dni: string;
  phone?: string;
  password: string;
  role: "user" | "admin" | "superAdmin";
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  isVerified: boolean;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    startUp: { type: String },
    email: { type: String, required: true, unique: true },
    dni: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password as string, salt);
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
