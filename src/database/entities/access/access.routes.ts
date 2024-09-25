import { Router } from "express";
import AccessController from "./access.controller";
import { authToken, isAdmin } from "../../../middleware/auth.middleware";

const router = Router();

router.get(
  "/current/room/:roomId",
  authToken,
  isAdmin,
  AccessController.getCurrentOccupancy
);
router.post("/check-in/:roomId", authToken, AccessController.checkIn);
router.post("/check-out/:roomId", authToken, AccessController.checkOut);
router.post("/reserve/:roomId", authToken, AccessController.makeReservation);
router.delete(
  "/cancel/:accessId",
  authToken,
  AccessController.cancelOwnReservation
);
router.delete(
  "/move-to-history",
  authToken,
  isAdmin,
  AccessController.moveOldAccessesToAccessHistory
);

export { router };
