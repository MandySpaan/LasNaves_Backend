import { Request, Response } from "express";
import { validationResult } from "express-validator";
import AuthService from "./auth.service";

class AuthController {
  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const sanitizedErrors = errors.array().map((error: any) => ({
        ...error,
        value: undefined,
      }));
      return res.status(400).json({ errors: sanitizedErrors });
    }

    const userInput = req.body;

    try {
      const userWithoutPassword = await AuthService.registerUser(userInput);
      return res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error(error);
      const errorMessage =
        (error as Error).message || "Server error. Please try again later.";
      return res.status(400).json({ message: errorMessage });
    }
  }

  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const sanitizedErrors = errors.array().map((error: any) => ({
        ...error,
        value: undefined,
      }));
      return res.status(400).json({ errors: sanitizedErrors });
    }

    const { email, password } = req.body;

    try {
      const token = await AuthService.loginUser(email, password);
      if (!token) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async requestPasswordReset(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const resetToken = await AuthService.generatePasswordResetToken(email);
      if (!resetToken) {
        return res.status(400).json({ message: "User not found" });
      }

      // ToDo: This has to be changed to send the resetToken via email in real implementation.
      return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    try {
      const isResetSuccessful = await AuthService.resetPassword(
        token,
        newPassword
      );
      if (!isResetSuccessful) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
}

export default new AuthController();
