import { Router } from "express";
import AuthController from "./auth.controller";
import AuthValidator from "../../../middleware/validators/authValidator";
import handleValidationResult from "../../../middleware/validators/validationResultHandler";

const router = Router();

router.post(
  "/register",
  AuthValidator.register(),
  handleValidationResult,
  AuthController.register
);
router.post("/resend-verification", AuthController.resendVerification);
router.get("/verify-email", AuthController.verifyEmail);
router.post(
  "/login",
  AuthValidator.login(),
  handleValidationResult,
  AuthController.login
);
router.post(
  "/request-password-reset",
  AuthValidator.passwordResetRequest(),
  handleValidationResult,
  AuthController.requestPasswordReset
);
router.post(
  "/reset-password",
  AuthValidator.resetPassword(),
  handleValidationResult,
  AuthController.resetPassword
);

export { router };
