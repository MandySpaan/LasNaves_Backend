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

  checkRoomOccupancy = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const roomOccupancy = await roomService.getRoomOccupancy(roomId);
    return res
      .status(200)
      .json({ message: "Room occupancy retrieved", roomOccupancy });
  };

  getRoomsCurrentStatus = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const roomStatus = await roomService.roomCurrentStatus(roomId);
    return res
      .status(200)
      .json({ message: "Room status retrieved", roomStatus });
  };
}

export default new roomController();
