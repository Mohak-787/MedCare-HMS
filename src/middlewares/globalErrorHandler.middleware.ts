import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { StatusCode } from "../constants/statusCode.constant";
import { Message } from "../constants/message.constant";

export const globalErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  const status = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
  
  let message = err.message || Message.INTERNAL_SERVER_ERROR;

  // Extract message from class-validator errors if present
  if (err.error && Array.isArray(err.error) && err.error.length > 0) {
    const firstError = err.error[0];
    if (firstError.constraints) {
      message = Object.values(firstError.constraints)[0] as string;
    } else if (firstError.children && firstError.children.length > 0) {
      // Handle one level of nested errors (common in DTOs)
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