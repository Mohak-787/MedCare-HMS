import { OtpService } from "../../services/otp/otp.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { VerifyOtpDto } from "../../dtos/otp/otp.dto";
import { plainToInstance } from "class-transformer";
import { ApiError } from "../../utils/apiError";
import { StatusCode } from "../../constants/statusCode.constant";
import { Message } from "../../constants/message.constant";
import { ApiResponse } from "../../utils/apiResponse";

export class OtpController {
  private otpService = new OtpService();

  verifyOtp = asyncHandler(
    async (req: Request, res: Response) => {
      const data = plainToInstance(VerifyOtpDto, req.body);

      const errors = await validate(data, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Validation failed", errors);
      }

      const result: any = await this.otpService.verifyOtp(data);

      if (result.status === StatusCode.SESSION_EXPIRED) {
        throw new ApiError(result.status, "OTP expired")
      }

      if (result.status === StatusCode.NOT_FOUND) {
        throw new ApiError(result.status, "User not found");
      }

      if (result.status === StatusCode.INTERNAL_SERVER_ERROR) {
        throw new ApiError(result.status, Message.INTERNAL_SERVER_ERROR);
      }

      res.status(result.status).json(
        new ApiResponse(result.status, null, "User verification successful")
      )
    }
  );

  resendOtp = asyncHandler(
    async (req: Request, res: Response) => {

    }
  );
}