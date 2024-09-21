import Room from "./room.model";

class roomService {
  async getAllRooms() {
    return await Room.find();
  }
}

export default new roomService();
