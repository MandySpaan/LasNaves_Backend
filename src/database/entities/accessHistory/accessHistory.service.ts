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
      .populate("userId", "name surName")
      .populate("roomId", "roomName");

    if (!accessHistories || accessHistories.length === 0) {
      throw new Error("No access histories found for the specified date range");
    }

    return accessHistories;
  }
}

export default new accessHistoryService();
