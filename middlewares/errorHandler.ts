import { NextFunction, Request, Response } from "express";
import { logEvents } from "./logEvents";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
    status: 500,
  });
};
