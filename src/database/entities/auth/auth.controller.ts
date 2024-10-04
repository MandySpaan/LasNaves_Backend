import { Request, Response } from "express";
import AuthService from "./auth.service";

class AuthController {
  async register(req: Request, res: Response) {
    const userInput = req.body;
    const userWithoutPassword = await AuthService.registerUser(userInput);

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
      user: userWithoutPassword,
    });
  }

  async resendVerification(req: Request, res: Response) {
    const { email } = req.body;
    await AuthService.resendVerificationEmail(email);
    res.status(200).json({ message: "Verification email sent" });
  }

  async verifyEmail(req: Request, res: Response) {
    const { token, email } = req.query as { token: string; email: string };
    const decodedEmail = decodeURIComponent(email);
    const result = await AuthService.verifyEmail(decodedEmail, token);
    //ToDo: Change this to the real domain that is being used
    return res.redirect(`http://localhost:5173/email-verified`);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await AuthService.loginUser(email, password);

    if (!token) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  }

  async requestPasswordReset(req: Request, res: Response) {
    const { email } = req.body;
    const resetToken = await AuthService.generatePasswordResetToken(email);

    if (!resetToken) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password reset email sent" });
  }

  async resetPassword(req: Request, res: Response) {
    const { token, email } = req.query as { token: string; email: string };
    const { newPassword } = req.body;
    const decodedEmail = decodeURIComponent(email);
    const isResetSuccessful = await AuthService.resetPassword(
      decodedEmail,
      token,
      newPassword
    );

    if (!isResetSuccessful) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.status(200).json({ message: "Password reset successful" });
  }
}

export default new AuthController();
