import { Router } from "express";
import AccessController from "./access.controller";
import { authToken } from "../../../middleware/auth.middleware";

const router = Router();

router.post("/check-in/:roomId", authToken, AccessController.checkIn);

export { router };
