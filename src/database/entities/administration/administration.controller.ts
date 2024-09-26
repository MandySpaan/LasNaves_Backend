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
}

export default new AdministrationController();
