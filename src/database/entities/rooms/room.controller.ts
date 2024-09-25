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

  updateRoomById = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;

    const currentRoom = await roomService.getRoomById(roomId);

    if (!currentRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const updatedRoom = await roomService.updateRoom(
      roomId,
      req.body,
      currentRoom
    );

    return res
      .status(200)
      .json({ message: "Room updated successfully", room: updatedRoom });
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
