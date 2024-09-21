import { Router } from "express";
import RoomController from "./room.controller";

const router = Router();

router.get("/all-rooms", RoomController.getAllRooms);

export { router };
