import { promises as fs } from "fs";
import path from "path";
import { format } from "date-fns";
import AccessHistory from "../accessHistory/accessHistory.model";
import Room from "../rooms/room.model";
import Administration, { IRoomUsage } from "./administration.model";
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

    for (const access of getAllAccesses) {
      if (access.roomId) {
        uniqueRoomIds.add(access.roomId.toString());
      }
    }

    const roomIdsArray = Array.from(uniqueRoomIds);

    const roomUsage: IRoomUsage[] = [];

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

        const completedAccesses = await AccessHistory.find({
          roomId: roomId,
          entryDateTime: { $gte: start, $lte: end },
          status: "completed",
        });

        let totalStayDuration = 0;
        let count = 0;

        completedAccesses.forEach((access) => {
          if (access.entryDateTime && access.exitDateTime) {
            const stayDuration =
              Number(new Date(access.exitDateTime)) -
              Number(new Date(access.entryDateTime));
            totalStayDuration += stayDuration;
            count++;
          }
        });

        let averageStayDuration = 0;
        if (count > 0) {
          averageStayDuration = Math.round(totalStayDuration / count / 60000);
        }

        const buildingOpenTime = 9;
        const buildingCloseTime = 18;

        let hourlyAccess: [number, number][] = [];

        for (let hour = buildingOpenTime; hour < buildingCloseTime; hour++) {
          const hourStart = new Date(start);
          hourStart.setHours(hour, 0, 0, 0);

          const hourEnd = new Date(hourStart);
          hourEnd.setHours(hour + 1, 0, 0, 0);

          const peopleCount = await AccessHistory.countDocuments({
            roomId: roomId,
            entryDateTime: { $lt: hourEnd },
            exitDateTime: { $gte: hourStart },
            status: "completed",
          });

          hourlyAccess.push([hour, peopleCount]);
        }

        const mapRoomUsage: IRoomUsage = {
          roomName,
          capacity,
          totalAccesses,
          totalAbsences,
          averageStayDuration,
          hourlyAccess,
        };
        roomUsage.push(mapRoomUsage);
      })
    );

    const newReport = new Administration({
      reportDate,
      totalAccesses,
      totalAbsences,
      frequentPeople,
      lessFrequentPeople,
      roomUsage,
    });

    const savedReport = await newReport.save();

    return {
      savedReport,
    };
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const uploadDir = path.resolve(__dirname, "../../../../uploads");

      await fs.mkdir(uploadDir, { recursive: true });

      const today = new Date();
      const formattedDate = format(today, "yyyy-MM-dd");

      const fileName = `${formattedDate}-daily-report.pdf`;

      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, file.buffer);

      return `/uploads/${fileName}`;
    } catch (error: any) {
      throw new Error("Error saving file: " + error.message);
    }
  }

  async reportsList() {
    try {
      const reportsDir = path.resolve(__dirname, "../../../../uploads");
      const files = await fs.readdir(reportsDir);

      const reports = files.map((file) => ({
        filename: file,
        _id: file,
      }));

      return reports;
    } catch (error) {
      throw new Error("Failed to retrieve reports.");
    }
  }

  async getReportsByDate(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      throw new Error("startDate and endDate query parameters are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format. Please provide valid dates.");
    }

    const reportsByDate = await Administration.find({
      reportDate: { $gte: start, $lte: end },
    });

    if (!reportsByDate || reportsByDate.length === 0) {
      throw new Error("No access histories found for the specified date range");
    }

    return reportsByDate;
  }

  async latestRoomUsage() {
    const latestReport = await Administration.findOne().sort({
      reportDate: -1,
    });
    if (!latestReport) {
      throw new Error("No reports found");
    }
    return latestReport.roomUsage;
  }
}

export default new AdministrationService();
