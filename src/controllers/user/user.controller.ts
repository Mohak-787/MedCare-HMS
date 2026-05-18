import { validate } from "class-validator";
import { Message } from "../../constants/message.constant";
import { StatusCode } from "../../constants/statusCode.constant";
import { UserService } from "../../services/user/user.service";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { SignupDto } from "../../dtos/auth/signup.dto";

export class UserController {
  private userService = new UserService();

  userInfo = asyncHandler(
    async (req: Request, res: Response) => {
      const result: any = await this.userService.userInfo(req.user);

      if (result.status === StatusCode.INTERNAL_SERVER_ERROR) {
        throw new ApiError(result.status, Message.INTERNAL_SERVER_ERROR, result.errors);
      }

      res.status(result.status).json(
        new ApiResponse(result.status,
          result.user,
          "User information fecthed successfully"
        )
      )
    }
  );

  updateUser = asyncHandler(
    async (req: Request, res: Response) => {
      const data = plainToInstance(SignupDto, req.body);

      const errors = await validate(data, {
        groups: ["update"],
        whitelist: true,
        forbidNonWhitelisted: true
      });

      if (errors.length > 0) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Validation error", errors);
      }

      const result: any = await this.userService.updateUser(data, req.user);

      if (result.status === StatusCode.NOT_FOUND) {
        throw new ApiError(result.status, "User not found");
      }

      res.status(result.status).json(
        new ApiResponse(result.status, null, "User information updated successfully")
      )
    }
  );

  deleteUser = asyncHandler(
    async (req: Request, res: Response) => {
      const result: any = await this.userService.deleteUser(req.user);

      if (result.status === StatusCode.NOT_FOUND) {
        throw new ApiError(result.status, "User not found");
      }

      return res.status(result.status).json(
        new ApiResponse(result.status, null, "User deleted successfully")
      )
    }
  );
}