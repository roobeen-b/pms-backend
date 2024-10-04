import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../custom";

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(401).json({
        message: "You are unauthorized!",
        status: 401,
      });
      return resolve();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        message: "Internal Server Error!",
        status: 500,
      });
      return resolve();
    }

    try {
      const decoded = jwt.verify(token, secret);

      if (decoded && typeof decoded === "object" && "userId" in decoded) {
        req.userId = (decoded as { userId: string }).userId;
        next();
        return resolve();
      } else {
        res.status(403).json({
          message: "Forbidden",
          status: 403,
        });
        return resolve();
      }
    } catch (error) {
      res.status(403).json({
        message: "Forbidden",
        status: 403,
      });
      return resolve();
    }
  });
};
