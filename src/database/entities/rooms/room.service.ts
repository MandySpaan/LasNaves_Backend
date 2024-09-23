import Access from "../access/access.model";
import Room from "./room.model";
import { IRoom } from "./room.model";

class roomService {
  async getAllRooms() {
    return await Room.find();
  }

  async createRoom(roomData: IRoom) {
    const { roomName, capacity, roomType } = roomData;

    const existingRoom = await Room.findOne({ roomName });
    if (existingRoom) {
      throw new Error("Room with this name already exists.");
    }

    const newRoom = new Room({
      roomName,
      capacity,
      roomType,
    });

    const savedRoom = await newRoom.save();
    return savedRoom;
  }

  async getRoomOccupancy(roomId: string) {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    const currentOccupancy = await Access.countDocuments({
      roomId,
    });

    const placesAvailable = room.capacity - currentOccupancy;

    return {
      currentOccupancy,
      placesAvailable,
    };
  }
}

export default new roomService();
