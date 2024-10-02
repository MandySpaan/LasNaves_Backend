import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../users/user.model";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../email/email.service";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// The "your_jwt_secret" can be set as a fallback value in case the .env is not set

interface RegisterUserInput {
  name: string;
  surname: string;
  startUp: string;
  email: string;
  dni: string;
  phone?: string;
  password: string;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  isVerified?: boolean;
}

class AuthService {
  async registerUser(userInput: RegisterUserInput) {
    const { name, surname, startUp, email, dni, phone, password } = userInput;

    const existingUser = await User.findOne({ $or: [{ email }, { dni }] });
    if (existingUser) {
      throw new Error("User with this email or DNI already exists.");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = await bcrypt.hash(verificationToken, 10);
    const verificationTokenExpires = new Date(Date.now() + 3600000);

    const newUser = new User({
      name,
      surname,
      startUp,
      email,
      dni,
      phone,
      password,
      verificationToken: hashedVerificationToken,
      verificationTokenExpires,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User with this email does not exist.");
    }

    if (user.isVerified) {
      throw new Error("This account is already verified.");
    }

    const newVerificationToken = crypto.randomBytes(32).toString("hex");
    const hashedNewVerificationToken = await bcrypt.hash(
      newVerificationToken,
      10
    );
    const newVerificationTokenExpires = new Date(Date.now() + 3600000);

    user.verificationToken = hashedNewVerificationToken;
    user.verificationTokenExpires = newVerificationTokenExpires;

    await user.save();

    await sendVerificationEmail(email, newVerificationToken);
  }

  async verifyEmail(email: string, token: string): Promise<boolean> {
    const user = await User.findOne({
      email,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired token.");
    }

    const isTokenValid = await bcrypt.compare(token, user.verificationToken!);
    if (!isTokenValid) {
      throw new Error("Invalid token.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();
    return true;
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    try {
      const user = await User.findOne({ email });
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "2h" }
      );
      return token;
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  async generatePasswordResetToken(email: string): Promise<string | null> {
    const user = await User.findOne({ email });
    if (!user) return null;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    return resetToken;
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await User.findOne({
      email,
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user || !user.resetPasswordToken) return false;

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) return false;

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return true;
  }
}

export default new AuthService();
