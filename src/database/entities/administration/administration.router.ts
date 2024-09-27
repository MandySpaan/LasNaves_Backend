import { Router } from "express";
import AdministrationController from "./administration.controller";
import { authToken, isAdmin } from "../../../middleware/auth.middleware";

const router = Router();

export { router };

router.post(
  "/create-report",
  authToken,
  isAdmin,
  AdministrationController.createDailyReport
);
router.get(
  "/get-reports",
  authToken,
  isAdmin,
  AdministrationController.getReportsByDate
);
