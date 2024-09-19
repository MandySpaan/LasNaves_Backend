import { Router } from "express";
import AuthController from "./auth.controller";
import Validator from "../../../middleware/validation.middleware";

const router = Router();

router.post(
  "/register",
  Validator.register(),
  Validator.handleValidationResult,
  AuthController.register
);
router.get(
  "/verify-email",
  Validator.handleValidationResult,
  AuthController.verifyEmail
);
router.post(
  "/login",
  Validator.login(),
  Validator.handleValidationResult,
  AuthController.login
);
router.post(
  "/request-password-reset",
  Validator.passwordResetRequest(),
  Validator.handleValidationResult,
  AuthController.requestPasswordReset
);
router.post(
  "/reset-password",
  Validator.resetPassword(),
  Validator.handleValidationResult,
  AuthController.resetPassword
);

export { router };
