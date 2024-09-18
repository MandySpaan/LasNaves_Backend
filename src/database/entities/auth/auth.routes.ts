import { Router } from "express";
import AuthController from "./auth.controller";
import {
  validateLogin,
  validatePasswordResetRequest,
  validateRegister,
  validateResetPassword,
} from "../../../middleware/validation.middleware";

const router = Router();

router.post("/register", validateRegister, AuthController.register);
router.post("/login", validateLogin, AuthController.login);
router.post(
  "/password-reset-request",
  validatePasswordResetRequest,
  AuthController.requestPasswordReset
);
router.post(
  "/reset-password",
  validateResetPassword,
  AuthController.resetPassword
);

export { router };
