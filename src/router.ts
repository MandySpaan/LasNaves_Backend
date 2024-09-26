import { Router } from "express";
import { router as authRouter } from "./database/entities/auth/auth.routes";
import { router as userRouter } from "./database/entities/users/user.routes";
import { router as roomRouter } from "./database/entities/rooms/room.routes";
import { router as accessRouter } from "./database/entities/access/access.routes";
import { router as accessHistoryRouter } from "./database/entities/accessHistory/accessHistory.routes";
import { router as administrationRouter } from "./database/entities/administration/administration.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/room", roomRouter);
router.use("/access", accessRouter);
router.use("/access-history", accessHistoryRouter);
router.use("/administration", administrationRouter);

export { router };
