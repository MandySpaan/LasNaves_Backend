import { body } from "express-validator";
import User from "../../database/entities/users/user.model";
import bcrypt from "bcrypt";

class UserValidator {
  static changePassword() {
    return [
      body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required")
        .custom(async (value, { req }) => {
          const userId = req.user?.userId;
          const user = await User.findById(userId);

          if (!user) {
            throw new Error("User not found");
          }

          const isMatch = await bcrypt.compare(value, user.password);
          if (!isMatch) {
            throw new Error("Old password is incorrect");
          }
          return true;
        }),
      body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long"),
      body("confirmNewPassword")
        .notEmpty()
        .withMessage("confirmNewPassword is required")
        .custom((value, { req }) => {
          if (value !== req.body.newPassword) {
            throw new Error("Passwords do not match");
          }
          return true;
        }),
    ];
  }
}

export default UserValidator;
