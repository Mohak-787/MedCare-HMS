import { Message } from "../../constants/message.constant";
import { StatusCode } from "../../constants/statusCode.constant";
import { UserService } from "../../services/user/user.service";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";

export class UserController {
  private userService = new UserService();

  userInfo = asyncHandler(
    async (req: Request, res: Response) => {
      const result: any = await this.userService.userInfo(req.user);

      if (result.status === StatusCode.INTERNAL_SERVER_ERROR) {
        throw new ApiError(result.satus, Message.INTERNAL_SERVER_ERROR, result.errors);
      }

      res.status(result.status).json(
        new ApiResponse(result.status,
          result.user,
          "User information fecthed successfully"
        )
      )
    }
  );
}