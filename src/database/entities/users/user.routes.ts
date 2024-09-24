import { Router } from "express";
import { authToken, isAdmin } from "../../../middleware/auth.middleware";
import UserController from "./user.controller";
import UserValidator from "../../../middleware/validators/userValidator";
import handleValidationResult from "../../../middleware/validators/validationResultHandler";

const router = Router();

router.get("/profile/own", authToken, UserController.getOwnProfile);
router.put("/profile/own", authToken, UserController.updateOwnProfile);
router.put(
  "/change-password",
  authToken,
  UserValidator.changePassword(),
  handleValidationResult,
  UserController.changePassword
);
router.get("/all", authToken, isAdmin, UserController.getAllUsers);
router.get(
  "/:userId/current-access",
  authToken,
  isAdmin,
  UserController.getUsersCurrentAccess
);

export { router };
