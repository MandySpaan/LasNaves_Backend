import AccessHistory from "../accessHistory/accessHistory.model";
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
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const populatedFrequentPeople = await AccessHistory.populate(
      rawFrequentPeople,
      {
        path: "_id",
        select: "name surname",
      }
    );

    const frequentPeople = populatedFrequentPeople.map((user: any) => ({
      name: `${user.userId.name} ${user.userId.surname}`,
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
        $sort: { count: 1 },
      },
      {
        $limit: 5,
      },
    ]);

    const populatedLessFrequentPeople = await AccessHistory.populate(
      rawLessFrequentPeople,
      {
        path: "_id",
        select: "name surname",
      }
    );

    const lessFrequentPeople = populatedFrequentPeople.map((user: any) => ({
      name: `${user.userId.name} ${user.userId.surname}`,
      count: user.count,
    }));

    const getAllAccesses = await AccessHistory.find({
      entryDateTime: { $gte: start, $lte: end },
    }).populate("roomId", "roomName capacity");

    const uniqueRoomIds = new Set();

    const roomUsage: IRoomUsage[] = [];

    getAllAccesses.forEach(async (access) => {
      if (access.roomId) {
        uniqueRoomIds.add(access.roomId);
      }

      await Promise.all(
        Array.from(uniqueRoomIds).map(async (room: any) => {
          const roomName = room.roomName;
          const capacity = room.capacity;
          const totalAccesses = await AccessHistory.countDocuments({
            roomId: room._id,
            entryDateTime: { $gte: start, $lte: end },
            $or: [
              { status: "completed" },
              { status: "completed (no check-out)" },
            ],
          });
          const totalAbsences = await AccessHistory.countDocuments({
            roomId: room._id,
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
    });

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
