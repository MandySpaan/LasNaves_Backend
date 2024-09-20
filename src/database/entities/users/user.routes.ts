import { Router } from "express";
import UserController from "./user.controller";
import { authToken } from "../../../middleware/auth.middleware";

const router = Router();

router.get("/profile/own", authToken, UserController.getOwnProfile);

export { router };
