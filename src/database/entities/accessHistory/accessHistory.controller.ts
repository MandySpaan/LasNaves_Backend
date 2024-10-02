import { Request, Response } from "express";
import accessHistoryService from "./accessHistory.service";

class AccessHistoryController {
  async getAccessHistoriesByDate(req: Request, res: Response) {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const accessHistoryByDate = await accessHistoryService.accessHistoryByDate(
      startDate,
      endDate
    );

    res.status(200).send({
      message: "Access histories retrieved successfully",
      accessHistory: accessHistoryByDate,
    });
  }

  async getRoomsAccessHistoriesByDate(req: Request, res: Response) {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const roomId = req.params.roomId;

    const roomAccessHistoryByDate =
      await accessHistoryService.roomAccessHistoryByDate(
        startDate,
        endDate,
        roomId
      );

    res.status(200).send({
      message: "Room's access histories retrieved successfully",
      accessHistory: roomAccessHistoryByDate,
    });
  }

  async getUsersAccessHistoryByDate(req: Request, res: Response) {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const userId = req.params.userId;

    const accessHistory = await accessHistoryService.usersAccessHistoryByDate(
      startDate,
      endDate,
      userId
    );

    return res
      .status(200)
      .json({ message: "User's access history retrieved", accessHistory });
  }
}

export default new AccessHistoryController();
