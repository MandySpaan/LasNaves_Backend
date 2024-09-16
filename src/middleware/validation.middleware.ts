import { body } from "express-validator";

export const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("surname").notEmpty().withMessage("Surname is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("dni").notEmpty().withMessage("DNI is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["user", "admin", "superAdmin"])
    .withMessage("Invalid role"),
];
