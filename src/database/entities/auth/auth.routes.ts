import { Router } from "express";
import { register } from "./auth.controller";
import { validateRegister } from "../../../middleware/validation.middleware";

const router = Router();

router.post("/register", validateRegister, register);

export { router };
