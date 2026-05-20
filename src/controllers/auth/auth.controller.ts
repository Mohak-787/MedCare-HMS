import { AuthService } from "../../services/auth/auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { SignupDto } from "../../dtos/auth/signup.dto";
import { ApiError } from "../../utils/apiError";
import { StatusCode } from "../../constants/statusCode.constant";
import { ApiResponse } from "../../utils/apiResponse";
import { SigninDto } from "../../dtos/auth/signin.dto";
import { accessMaxage, refreshMaxage, getCookieOptions } from "../../constants/token.constant";
import { ChangePasswordDto } from "../../dtos/auth/changePassword.dto";
import { ResetPasswordDto } from "../../dtos/auth/resetPassword.dto";
import { ForgotPasswordDto } from "../../dtos/auth/forgotPassword.dto";

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

      res.status(result.status).json(
        new ApiResponse(result.status, null, "Signup successful")
      )
    }
  );

  signin = asyncHandler(
    async (req: Request, res: Response) => {
      const data = plainToInstance(SigninDto, req.body);

      const errors = await validate(data, {
        whitelist: true,
        forbidNonWhitelisted: true
      });

      if (errors.length > 0) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Validation failed", errors);
      }

      const result: any = await this.authService.signin(data);

      if (result.status === StatusCode.UNAUTHORIZED) {
        throw new ApiError(StatusCode.UNAUTHORIZED, "Invalid credentials");
      }

      if (result.status === StatusCode.BAD_REQUEST) {
        throw new ApiError(result.status, "Email verification required");
      }

      res.cookie('refreshToken', result?.refreshToken, getCookieOptions(refreshMaxage));
      res.cookie('accessToken', result?.accessToken, getCookieOptions(accessMaxage));

      res.status(result.status).json(
        new ApiResponse(result.status, null, "Signin successful")
      );
    }
  );

  changePassword = asyncHandler(
    async (req: Request, res: Response) => {
      const data = plainToInstance(ChangePasswordDto, req.body);
      const errors = await validate(data, {
        whitelist: true,
        forbidNonWhitelisted: true
      });

      if (errors.length > 0) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Validation failed", errors);
      }

      const result: any = await this.authService.changePassword(data, req.user);

      if (result.status === StatusCode.NOT_FOUND) {
        throw new ApiError(result.status, "User not found");
      }

      if (result.status === StatusCode.BAD_REQUEST) {
        throw new ApiError(result.status, "Incorrect old password");
      }

      res.clearCookie("accessToken", getCookieOptions());
      res.clearCookie("refreshToken", getCookieOptions());

      res.status(result.status).json(
        new ApiResponse(result.status, null, "Password changed successfully")
      )
    }
  );

  resetPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const data = plainToInstance(ResetPasswordDto, req.body);

      const errors = await validate(data, {
        whitelist: true,
        forbidNonWhitelisted: true
      });

      if (errors.length > 0) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Validation error", errors);
      }

      const result: any = await this.authService.resetPassword(data, req.payload);

      if (result.status === StatusCode.NOT_FOUND) {
        throw new ApiError(result.status, "User not found");
      }

      res.clearCookie("tempToken", getCookieOptions());
      res.status(result.status).json(
        new ApiResponse(result.status, null, "Password reset sucessfully")
      )
    }
  );

  forgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const data = plainToInstance(ForgotPasswordDto, req.body);

      const errors = await validate(data, {
        whitelist: true,
        forbidNonWhitelisted: true
      });

      if (errors.length > 0) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Validation error", errors);
      }

      const result: any = await this.authService.forgotPassword(data);

      if (result.status === StatusCode.NOT_FOUND) {
        throw new ApiError(result.status, "User not found");
      }

      res.status(result.status).json(
        new ApiResponse(result.status, null, "OTP sent successfully")
      )
    }
  );

  logout = asyncHandler(
    async (req: Request, res: Response) => {
      const result: any = await this.authService.logout(req.user);

      if (result.status === StatusCode.NOT_FOUND) {
        throw new ApiError(result.status, "User not found");
      }

      res.clearCookie("accessToken", getCookieOptions());
      res.clearCookie("refreshToken", getCookieOptions());

      res.status(result.status).json(
        new ApiResponse(result.status, null, "User logged out successfully")
      )
    }
  );

  logoutAllDevice = asyncHandler(
    async (req: Request, res: Response) => {
      const result: any = await this.authService.logoutAllDevice(req.user);

      if (result.status === StatusCode.NOT_FOUND) {
        throw new ApiError(result.status, "User not found");
      }

      res.clearCookie("accessToken", getCookieOptions());
      res.clearCookie("refreshToken", getCookieOptions());

      res.status(result.status).json(
        new ApiResponse(result.status, null, "User logged out from all device successfully")
      )
    }
  );
}