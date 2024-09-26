import AccessHistory from "../accessHistory/accessHistory.model";
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

    return {
      reportDate,
      totalAccesses,
      totalAbsences,
      frequentPeople,
      lessFrequentPeople,
    };
  }
}
