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
}

export default new AuthController();
