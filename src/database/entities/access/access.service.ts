import AccessHistory from "../accessHistory/accessHistory.model";
import Room from "../rooms/room.model";
import Access from "./access.model";

class AccessService {
  async checkIn(userId: string, roomId: string) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const currentOccupancy = await Access.countDocuments({
      roomId,
      active: true,
    });

    const placesAvailable = room.capacity - currentOccupancy;
    if (placesAvailable <= 0) {
      throw new Error("Room is full");
    }

    const activeAccess = await Access.findOne({
      userId,
      roomId,
      active: true,
    });

    if (activeAccess) {
      throw new Error("User already checked in");
    }

    const newAccess = new Access({
      userId,
      roomId,
      entryDateTime: new Date(),
    });

    await newAccess.save();
    return newAccess;
  }

  async checkOut(userId: string, roomId: string) {
    const access = await Access.findOne({ userId, roomId, active: true });

    if (!access) {
      throw new Error("User not checked in");
    }

    access.exitDateTime = new Date();
    access.active = false;

    const accessHistory = new AccessHistory({
      userId,
      roomId,
      entryDateTime: access.entryDateTime,
      exitDateTime: access.exitDateTime,
    });

    await accessHistory.save();
    await Access.deleteOne({ _id: access._id });
    return accessHistory;
  }
}

export default new AccessService();
