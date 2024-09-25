import { Request, Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import UserService from "./user.service";

class UserController {
  async getOwnProfile(req: AuthRequest, res: Response) {
    const userId = req.user?.userId as string;

    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Profile fetched successfully", user });
  }

  async updateOwnProfile(req: AuthRequest, res: Response) {
    const userId = req.user?.userId as string;

    const currentUser = await UserService.getUserById(userId);

    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ message: "No fields provided for update" });
    }

    const updatedUser = await UserService.updateUser(
      userId,
      req.body,
      currentUser
    );

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  }

  async changePassword(req: AuthRequest, res: Response) {
    const userId = req.user?.userId as string;
    const { newPassword } = req.body;

    const currentUser = await UserService.getUserById(userId);

    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const updatedUser = await UserService.updatePassword(userId, newPassword);

    return res
      .status(200)
      .json({ message: "Password updated successfully", user: updatedUser });
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await UserService.getAllUsers();
    return res.status(200).json({ message: "All users retrieved", users });
  }

  async getUsersCurrentAccess(req: AuthRequest, res: Response) {
    const userId = req.params.userId;

    const currentAccess = await UserService.usersCurrentAccess(userId);

    return res
      .status(200)
      .json({ message: "User's current access retrieved", currentAccess });
  }

  async getUsersAccessHistory(req: AuthRequest, res: Response) {
    const userId = req.params.userId;

    const accessHistory = await UserService.usersAccessHistory(userId);

    return res
      .status(200)
      .json({ message: "User's access history retrieved", accessHistory });
  }
}

export default new UserController();
