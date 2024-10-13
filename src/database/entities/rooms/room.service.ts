import Access from "../access/access.model";
import Room from "./room.model";
import { IRoom } from "./room.model";

class roomService {
  async getAllRooms() {
    return await Room.find();
  }

  async getRoomById(roomId: string) {
    return await Room.findById(roomId);
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

  async updateRoom(roomId: string, roomData: Partial<IRoom>, currentRoom: any) {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    const updatedFields = {
      roomName: roomData.roomName || currentRoom.roomName,
      capacity: roomData.capacity || currentRoom.capacity,
      roomType: roomData.roomType || currentRoom.roomType,
    };

    return await Room.findByIdAndUpdate(roomId, updatedFields, {
      new: true,
      runValidators: true,
    });
  }

  async getRoomOccupancy(roomId: string) {
    const room = await Room.findById(roomId);
    const timeNow = new Date();

    if (!room) {
      throw new Error("Room not found");
    }

    const currentOccupancy = await Access.countDocuments({
      roomId,
      status: "active",
      entryDateTime: { $lte: timeNow },
      $or: [
        { exitDateTime: { $gte: new Date() } },
        { exitDateTime: { $exists: false } },
      ],
    });

    const currentReserved = await Access.countDocuments({
      roomId,
      status: "reserved",
      entryDateTime: { $lte: timeNow },
      exitDateTime: { $gte: timeNow },
    });

    const placesAvailable = room.capacity - currentOccupancy - currentReserved;

    return {
      currentOccupancy,
      currentReserved,
      placesAvailable,
    };
  }

  async roomCurrentStatus(roomId: string) {
    const access = await Access.find({
      roomId: roomId,
      entryDateTime: { $lte: new Date() },
      $or: [
        { exitDateTime: { $gte: new Date() } },
        { exitDateTime: { $exists: false } },
      ],
    })
      .populate("userId", "name surname")
      .populate("roomId", "roomName");

    if (!access || access.length === 0) {
      return { message: "Room has no current check-ins nor reservations" };
    }

    const result = access.map((access: any) => ({
      roomName: access.roomId.roomName,
      status: access.status,
      userName: `${access.userId.name} ${access.userId.surname}`,
      accessDateTime: access.entryDateTime,
      exitDateTime: access.exitDateTime ? access.exitDateTime : undefined,
    }));

    return {
      access: result,
    };
  }
}

export default new roomService();
