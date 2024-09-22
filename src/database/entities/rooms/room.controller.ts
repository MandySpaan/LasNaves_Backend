import { Request, Response } from "express";
import roomService from "./room.service";

class roomController {
  getAllRooms = async (req: Request, res: Response) => {
    const rooms = await roomService.getAllRooms();
    return res.status(200).json({ message: "All rooms retrieved", rooms });
  };

  createRoom = async (req: Request, res: Response) => {
    const roomData = req.body;
    const newRoom = await roomService.createRoom(roomData);
    return res.status(201).json({ message: "Room created", newRoom });
  };
}

export default new roomController();
