import { Router } from "express";
import AuthController from "./auth.controller";
import {
  validateLogin,
  validateRegister,
} from "../../../middleware/validation.middleware";

const router = Router();

router.post("/register", validateRegister, AuthController.register);
router.post("/login", validateLogin, AuthController.login);

export { router };
