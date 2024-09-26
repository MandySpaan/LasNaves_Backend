import AccessHistory from "../accessHistory/accessHistory.model";
import Room from "../rooms/room.model";
import { IRoomUsage } from "./administration.model";
import { getReportDate, getYesterdayDateRange } from "./administration.utils";

class AdministrationService {
  async createDailyReport() {
    const { start, end } = getYesterdayDateRange();
    const reportDate = getReportDate();

    const totalAccesses = await AccessHistory.countDocuments({
      $or: [{ status: "completed" }, { status: "completed (no check-out)" }],
      entryDateTime: { $gte: start, $lte: end },
    });

    const totalAbsences = await AccessHistory.countDocuments({
      status: "no-show",
      entryDateTime: { $gte: start, $lte: end },
    });

    const rawFrequentPeople = await AccessHistory.aggregate([
      {
        $match: {
          entryDateTime: { $gte: start, $lte: end },
          $or: [
            { status: "completed" },
            { status: "completed (no check-out)" },
          ],
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: "$userInfo.name",
          surname: "$userInfo.surname",
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const frequentPeople = rawFrequentPeople.map((user: any) => ({
      name: `${user.name} ${user.surname}`,
      count: user.count,
    }));

    const rawLessFrequentPeople = await AccessHistory.aggregate([
      {
        $match: {
          entryDateTime: { $gte: start, $lte: end },
          $or: [
            { status: "completed" },
            { status: "completed (no check-out)" },
          ],
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: "$userInfo.name",
          surname: "$userInfo.surname",
        },
      },
      {
        $sort: { count: 1 },
      },
      {
        $limit: 5,
      },
    ]);

    const lessFrequentPeople = rawLessFrequentPeople.map((user: any) => ({
      name: `${user.name} ${user.surname}`,
      count: user.count,
    }));

    const getAllAccesses = await AccessHistory.find({
      entryDateTime: { $gte: start, $lte: end },
    });

    const uniqueRoomIds = new Set();

    const roomUsage: IRoomUsage[] = [];

    for (const access of getAllAccesses) {
      if (access.roomId) {
        uniqueRoomIds.add(access.roomId);
      }
    }

    const roomIdsArray = Array.from(uniqueRoomIds);

    await Promise.all(
      roomIdsArray.map(async (roomId: any) => {
        const room = await Room.findById(roomId);
        if (!room) {
          throw new Error(`Room with ID ${roomId} not found`);
        }
        const roomName = room.roomName;
        const capacity = room.capacity;
        const totalAccesses = await AccessHistory.countDocuments({
          roomId: roomId,
          entryDateTime: { $gte: start, $lte: end },
          $or: [
            { status: "completed" },
            { status: "completed (no check-out)" },
          ],
        });
        const totalAbsences = await AccessHistory.countDocuments({
          roomId: roomId,
          entryDateTime: { $gte: start, $lte: end },
          status: "no-show",
        });

        const mapRoomUsage: IRoomUsage = {
          roomName,
          capacity,
          totalAccesses,
          totalAbsences,
          averageStayDuration: 0,
          hourlyAccess: [],
        };
        roomUsage.push(mapRoomUsage);
      })
    );

    return {
      reportDate,
      totalAccesses,
      totalAbsences,
      frequentPeople,
      lessFrequentPeople,
      roomUsage,
    };
  }
}

export default new AdministrationService();
