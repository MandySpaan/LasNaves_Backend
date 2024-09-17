import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { registerUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const sanitizedErrors = errors.array().map((error: any) => {
      return { ...error, value: undefined };
    });

    return res.status(400).json({ errors: sanitizedErrors });
  }

  const userInput = req.body;

  try {
    const userWithoutPassword = await registerUser(userInput);
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
};
