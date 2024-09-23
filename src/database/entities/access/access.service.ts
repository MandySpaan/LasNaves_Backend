import Room from "../rooms/room.model";
import Access from "./access.model";

class AccessService {
  async checkIn(userId: string, roomId: string) {
    const room = await Room.findById(roomId);
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
}

export default new AccessService();
