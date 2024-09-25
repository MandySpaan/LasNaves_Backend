import { access } from "fs";
import Access from "../access/access.model";
import AccessHistory from "../accessHistory/accessHistory.model";
import User from "./user.model";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
// The "your_jwt_secret" can be set as a fallback value in case the .env is not set

class UserService {
  async getUserById(userId: string) {
    return await User.findById(userId).select("-password");
  }

  async updateUser(
    userId: string,
    updateData: Partial<{
      name: string;
      surname: string;
      startUp?: string;
      dni: string;
      phone?: string;
    }>,
    currentUser: any
  ) {
    const updatedFields = {
      name: updateData.name || currentUser.name,
      surname: updateData.surname || currentUser.surname,
      startUp: updateData.startUp || currentUser.startUp,
      dni: updateData.dni || currentUser.dni,
      phone: updateData.phone || currentUser.phone,
    };

    return await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async updatePassword(userId: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      {}
    ).select("-password");
  }

  async getAllUsers() {
    return await User.find().select("-password");
  }

  async usersCurrentAccess(userId: string) {
    const access = await Access.findOne({ userId: userId, status: "active" })
      .populate("userId", "name surname")
      .populate("roomId", "roomName");

    if (!access) {
      throw new Error("User currently not checked in anywhere");
    }

    return {
      userName: `${(access.userId as any).name} ${
        (access.userId as any).surname
      }`,
      roomName: (access.roomId as any).roomName,
      entryDateTime: access.entryDateTime,
    };
  }

  async usersAccessHistory(userId: string) {
    const accessHistory = await AccessHistory.find({ userId: userId })
      .populate("userId", "name surname")
      .populate("roomId", "roomName");

    if (!accessHistory || accessHistory.length === 0) {
      throw new Error("No access history found for user");
    }

    const result = accessHistory.map((access: any) => ({
      userName: `${access.userId.name} ${access.userId.surname}`,
      roomName: access.roomId.roomName,
      status: access.status,
      entryDateTime: access.entryDateTime,
      exitDateTime: access.exitDateTime,
    }));
    return result;
  }
}

export default new UserService();
