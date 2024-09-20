import { Request, Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import UserService from "./user.service";

class UserController {
  async getOwnProfile(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const userId = await UserService.verifyToken(authReq);

    if (!userId) {
      return res.status(401).send({ message: "Unauthorized, no valid token" });
    }

    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Profile fetched successfully", user });
  }
}

export default new UserController();
