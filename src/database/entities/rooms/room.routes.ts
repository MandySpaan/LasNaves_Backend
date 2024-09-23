import { Router } from "express";
import { authToken, isSuperAdmin } from "../../../middleware/auth.middleware";
import RoomController from "./room.controller";
import RoomValidator from "../../../middleware/validators/roomValidator";
import handleValidationResult from "../../../middleware/validators/validationResultHandler";

const router = Router();

router.get("/all", RoomController.getAllRooms);
router.post(
  "/create",
  authToken,
  isSuperAdmin,
  RoomValidator.createRoom(),
  handleValidationResult,
  RoomController.createRoom
);
router.get("/occupancy/:roomId", RoomController.checkRoomOccupancy);

export { router };
