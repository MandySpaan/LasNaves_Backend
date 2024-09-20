// auth.service.ts

import jwt from "jsonwebtoken";
import User from "./user.model";
import { AuthRequest } from "../../../middleware/auth.middleware";

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
}

export default new UserService();
