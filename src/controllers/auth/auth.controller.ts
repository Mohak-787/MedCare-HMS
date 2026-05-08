import { AuthService } from "../../services/auth/auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { SignupDto } from "../../dtos/auth/signup.dto";
import { ApiError } from "../../utils/apiError";
import { StatusCode } from "../../constants/statusCode.constant";
import { ApiResponse } from "../../utils/apiResponse";

export class AuthController {
  private authService = new AuthService();

  signup = asyncHandler(
    async (req: Request, res: Response) => {
      const data = plainToInstance(SignupDto, req.body);

      const errors = await validate(data, {
        groups: ["create"],
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Validation failed", errors);
      }

      const result: any = await this.authService.signup(data);

      if (result.status !== StatusCode.CREATED) {
        throw new ApiError(StatusCode.ALREADY_EXIST, "User already exists");
      }

      res.status(StatusCode.CREATED).json(
        new ApiResponse(StatusCode.CREATED, null, "Signup successful")
      )
    }
  );
}