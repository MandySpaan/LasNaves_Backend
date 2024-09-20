// auth.service.ts

import jwt from "jsonwebtoken";
import User from "./user.model";
import { AuthRequest } from "../../../middleware/auth.middleware";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
// The "your_jwt_secret" can be set as a fallback value in case the .env is not set

class UserService {
  async verifyToken(req: AuthRequest): Promise<string | null> {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return null;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
      };
      return decoded.userId;
    } catch (err) {
      return null;
    }
  }

  async getUserById(userId: string) {
    return await User.findById(userId).select("-password");
  }
}

export default new UserService();
