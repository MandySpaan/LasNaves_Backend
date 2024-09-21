import { Router } from "express";
import RoomController from "./room.controller";
import { authToken, isSuperAdmin } from "../../../middleware/auth.middleware";
import Validator from "../../../middleware/validation.middleware";

const router = Router();

router.get("/all", RoomController.getAllRooms);
router.post(
  "/create",
  authToken,
  isSuperAdmin,
  Validator.createRoom(),
  Validator.handleValidationResult,
  RoomController.createRoom
);

export { router };
