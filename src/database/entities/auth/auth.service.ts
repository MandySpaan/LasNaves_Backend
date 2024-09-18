import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../users/user.model";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// The "your_jwt_secret" can be set as a fallback value in case the .env is not set

interface RegisterUserInput {
  name: string;
  surname: string;
  startUp: string;
  email: string;
  dni: string;
  phone: string;
  password: string;
}

class AuthService {
  async registerUser(userInput: RegisterUserInput) {
    const { name, surname, startUp, email, dni, phone, password } = userInput;

    const existingUser = await User.findOne({ $or: [{ email }, { dni }] });
    if (existingUser) {
      throw new Error("User with this email or DNI already exists.");
    }

    const newUser = new User({
      name,
      surname,
      startUp,
      email,
      dni,
      phone,
      password,
    });

    const savedUser = await newUser.save();

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    try {
      const user = await User.findOne({ email });
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      const token = jwt.sign(
        { userId: user._id, email: user.email },
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

    // For testing purposes
    const resetToken = "test-reset-token";

    // ToDo: The resetToken has to be changed to a random token in real implementation:
    // const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await User.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user || !user.resetPasswordToken) return false;

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) return false;

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return true;
  }
}

export default new AuthService();
