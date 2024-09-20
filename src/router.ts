import { Router } from "express";
import { router as authRouter } from "./database/entities/auth/auth.routes";
import { router as userRouter } from "./database/entities/users/user.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);

export { router };
