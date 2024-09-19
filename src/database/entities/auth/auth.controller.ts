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

  async verifyEmail(req: Request, res: Response) {
    const { token } = req.query as { token: string };
    const result = await AuthService.verifyEmail(token);
    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
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

    // ToDo: This has to be changed to send the resetToken via email in real implementation.
    res.status(200).json({ message: "Password reset email sent" });
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    const isResetSuccessful = await AuthService.resetPassword(
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
