import { Request, Response } from "express";
import roomService from "./room.service";

class roomController {
  getAllRooms = async (req: Request, res: Response) => {
    const rooms = await roomService.getAllRooms();
    return res.status(200).json({ message: "All rooms retrieved", rooms });
  };
}

export default new roomController();
