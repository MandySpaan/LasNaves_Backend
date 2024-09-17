import { body } from "express-validator";

export const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("surname").notEmpty().withMessage("Surname is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("dni").notEmpty().withMessage("DNI is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
