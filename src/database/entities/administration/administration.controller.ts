import { Request, Response } from "express";
import administrationService from "./administration.service";

class AdministrationController {
  async createDailyReport(req: Request, res: Response) {
    const reportData = await administrationService.createDailyReport();

    res.status(200).send({
      message: "Daily report created successfully",
      reportData,
    });
  }

  async uploadReport(req: Request, res: Response) {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const filePath = await administrationService.uploadFile(req.file);
    return res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      filePath,
    });
  }

  async getReportsByDate(req: Request, res: Response) {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const reports = await administrationService.getReportsByDate(
      startDate,
      endDate
    );

    res.status(200).send({
      message: "Reports retrieved successfully",
      reports,
    });
  }

  async getLatestRoomUsage(req: Request, res: Response) {
    const roomUsage = await administrationService.latestRoomUsage();

    res.status(200).send({
      message: "Most recent room usage retrieved successfully",
      roomUsage,
    });
  }
}

export default new AdministrationController();
