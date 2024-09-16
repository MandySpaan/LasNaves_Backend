import { Router } from "express";
import { router as authRouter } from "./database/entities/auth/auth.routes";

const router = Router();

router.use("/auth", authRouter);

export { router };
