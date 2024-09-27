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
}

export default new AdministrationController();
