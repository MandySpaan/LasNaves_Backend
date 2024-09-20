import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
// The "your_jwt_secret" can be set as a fallback value in case the .env is not set

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function authToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send({ message: "No token found" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).send({ message: "Token expired" });
      }
      return res.status(403).send({ message: "Invalid token" });
    }
    req.user = user as { userId: string; email: string };
    next();
  });
}
