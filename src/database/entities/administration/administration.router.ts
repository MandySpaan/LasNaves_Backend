import { Router } from "express";
import multer from "multer";
import AdministrationController from "./administration.controller";
import { authToken, isAdmin } from "../../../middleware/auth.middleware";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

export { router };

router.post(
  "/create-report",
  authToken,
  isAdmin,
  AdministrationController.createDailyReport
);
router.post(
  "/upload-report",
  authToken,
  isAdmin,
  upload.single("pdf"),
  AdministrationController.uploadReport
);
router.get(
  "/reports",
  authToken,
  isAdmin,
  AdministrationController.getReportsList
);
router.get(
  "/get-reports",
  authToken,
  isAdmin,
  AdministrationController.getReportsByDate
);
router.get(
  "/latest-room-usage",
  authToken,
  isAdmin,
  AdministrationController.getLatestRoomUsage
);
