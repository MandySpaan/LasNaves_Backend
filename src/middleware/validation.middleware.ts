import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import User from "../database/entities/users/user.model";

class Validator {
  static register() {
    return [
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
  }

  static login() {
    return [
      body("email").isEmail().withMessage("Please provide a valid email"),
      body("password").not().isEmpty().withMessage("Password cannot be empty"),
      body("email").custom(async (email) => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        if (!user.isVerified) {
          throw new Error(
            "Email is not verified. Please verify your email first."
          );
        }
        return true;
      }),
    ];
  }

  static passwordResetRequest() {
    return [body("email").isEmail().withMessage("Invalid email address")];
  }
  static resetPassword() {
    return [
      body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long"),
    ];
  }

  static handleValidationResult(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const sanitizedErrors = errors.array().map((error) => ({
        ...error,
        value: undefined,
      }));
      return res.status(400).json({ errors: sanitizedErrors });
    }
    next();
  }
}

export default Validator;
