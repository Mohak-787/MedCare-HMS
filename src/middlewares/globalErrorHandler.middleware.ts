import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { StatusCode } from "../constants/statusCode.constant";
import { Message } from "../constants/message.constant";
import { Logger } from "../utils/chalk";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(`${err.message || err}\nStack: ${err.stack || "N/A"}`);

  const status = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
  let message: string = Message.INTERNAL_SERVER_ERROR;

  if (status !== StatusCode.INTERNAL_SERVER_ERROR) {
    message = err.message || Message.INTERNAL_SERVER_ERROR;
  } else if (process.env.NODE_ENV !== "production") {
    message = err.message || Message.INTERNAL_SERVER_ERROR;
  }

  // Extract message from class-validator validation errors if present
  if (err.error && Array.isArray(err.error) && err.error.length > 0) {
    const firstError = err.error[0];
    if (firstError.constraints) {
      message = Object.values(firstError.constraints)[0] as string;
    } else if (firstError.children && firstError.children.length > 0) {
      const firstChild = firstError.children[0];
      if (firstChild.constraints) {
        message = Object.values(firstChild.constraints)[0] as string;
      }
    }
  }

  res.status(status).json({
    status: status,
    message: message,
  });
};