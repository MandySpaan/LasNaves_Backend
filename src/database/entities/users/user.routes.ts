import { Router } from "express";
import UserController from "./user.controller";
import { authToken } from "../../../middleware/auth.middleware";

const router = Router();

router.get("/profile/own", authToken, UserController.getOwnProfile);
router.put("/profile/own", authToken, UserController.updateOwnProfile);

export { router };
