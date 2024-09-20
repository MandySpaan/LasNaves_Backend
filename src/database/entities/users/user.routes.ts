import { Router } from "express";
import { authToken, isAdmin } from "../../../middleware/auth.middleware";
import UserController from "./user.controller";
import Validator from "../../../middleware/validation.middleware";

const router = Router();

router.get("/profile/own", authToken, UserController.getOwnProfile);
router.put("/profile/own", authToken, UserController.updateOwnProfile);
router.put(
  "/change-password",
  authToken,
  Validator.changePassword(),
  Validator.handleValidationResult,
  UserController.changePassword
);
router.get("/all", authToken, isAdmin, UserController.getAllUsers);

export { router };
