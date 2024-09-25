import { Router } from "express";
import {
  authToken,
  isAdmin,
  isSuperAdmin,
} from "../../../middleware/auth.middleware";
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
router.put(
  "/update/:roomId",
  authToken,
  isSuperAdmin,
  RoomController.updateRoomById
);
router.get("/occupancy/:roomId", RoomController.checkRoomOccupancy);
router.get(
  "/status/:roomId",
  authToken,
  isAdmin,
  RoomController.getRoomsCurrentStatus
);

export { router };
