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
  res.status(status).json({
    status: status,
    message: err.message || Message.INTERNAL_SERVER_ERROR,
  });
};