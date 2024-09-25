import { Router } from "express";
import accessHistoryController from "./accessHistory.controller";
import { authToken, isAdmin } from "../../../middleware/auth.middleware";

const router = Router();

router.get(
  "/date",
  authToken,
  isAdmin,
  accessHistoryController.getAccessHistoriesByDate
);
router.get(
  "/room/:roomId/date",
  authToken,
  isAdmin,
  accessHistoryController.getRoomsAccessHistoriesByDate
);

export { router };
