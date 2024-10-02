import AccessHistory from "./accessHistory.model";

class accessHistoryService {
  async allAccessHistory() {
    return await AccessHistory.find();
  }

  async accessHistoryByDate(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      throw new Error("startDate and endDate query parameters are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format. Please provide valid dates.");
    }

    const accessHistories = await AccessHistory.find({
      entryDateTime: { $gte: start, $lte: end },
    })
      .populate("userId", "name surname")
      .populate("roomId", "roomName");

    if (!accessHistories || accessHistories.length === 0) {
      throw new Error("No access histories found for the specified date range");
    }

    return accessHistories;
  }

  async roomAccessHistoryByDate(
    startDate: string,
    endDate: string,
    roomId: string
  ) {
    if (!startDate || !endDate) {
      throw new Error("startDate and endDate query parameters are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format. Please provide valid dates.");
    }

    const roomsAccessHistories = await AccessHistory.find({
      roomId: roomId,
      entryDateTime: { $gte: start, $lte: end },
    })
      .populate("userId", "name surname")
      .populate("roomId", "roomName");

    if (!roomsAccessHistories || roomsAccessHistories.length === 0) {
      throw new Error("No access histories found for the specified date range");
    }

    return roomsAccessHistories;
  }

  async usersAccessHistoryByDate(
    startDate: string,
    endDate: string,
    userId: string
  ) {
    if (!startDate || !endDate) {
      throw new Error("startDate and endDate query parameters are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format. Please provide valid dates.");
    }

    const usersAccessHistory = await AccessHistory.find({
      userId: userId,
      entryDateTime: { $gte: start, $lte: end },
    })
      .populate("userId", "name surname")
      .populate("roomId", "roomName");

    if (!usersAccessHistory || usersAccessHistory.length === 0) {
      throw new Error("No access histories found for the specified date range");
    }

    const result = usersAccessHistory.map((access: any) => ({
      _id: access._id,
      userName: `${access.userId.name} ${access.userId.surname}`,
      roomName: access.roomId.roomName,
      status: access.status,
      entryDateTime: access.entryDateTime,
      exitDateTime: access.exitDateTime,
    }));
    return result;
  }
}

export default new accessHistoryService();
