import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../users/user.model";

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, surname, startUp, email, dni, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { dni }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or DNI already exists." });
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

    return res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
