import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import AccessService from "./access.service";

class AccessController {
  async getCurrentOccupancy(req: AuthRequest, res: Response) {
    const roomId = req.params.roomId as string;

    const currentOccupancy = await AccessService.currentOccupancy(roomId);

    res.status(200).send({
      message: `There are people currently checked into roomId: ${roomId}`,
      currentOccupancy,
    });
  }

  async checkIn(req: AuthRequest, res: Response) {
    const userId = req.user?.userId as string;
    const roomId = req.params.roomId as string;

    const newAccess = await AccessService.checkIn(userId, roomId);

    res.status(200).send({ message: "Checked in successfully", newAccess });
  }

  async checkOut(req: AuthRequest, res: Response) {
    const userId = req.user?.userId as string;
    const roomId = req.params.roomId as string;

    const accessHistory = await AccessService.checkOut(userId, roomId);

    res
      .status(200)
      .send({ message: "Checked out successfully", accessHistory });
  }

  async makeReservation(req: AuthRequest, res: Response) {
    const userId = req.user?.userId as string;
    const roomId = req.params.roomId as string;
    const entryDateTime = req.body.entryDateTime as Date;
    const exitDateTime = req.body.exitDateTime as Date;

    const newReservation = await AccessService.reservePlace(
      userId,
      roomId,
      entryDateTime,
      exitDateTime
    );

    res.status(200).send({ message: "Reserved successfully", newReservation });
  }

  async cancelOwnReservation(req: AuthRequest, res: Response) {
    const userId = req.user?.userId as string;
    const accessId = req.params.accessId as string;

    const cancellation = await AccessService.cancelOwnReservation(
      userId,
      accessId
    );

    res.status(200).send({ message: "Reservation cancelled", cancellation });
  }
}
export default new AccessController();
