import { User } from "../../entities/user.entity";
import { UserInfoResponse } from "../../dtos/user/userInfo.dto";
import ServerDataSource from "../../configs/db.config";
import { StatusCode } from "../../constants/statusCode.constant";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export class UserService {
  private userRepository = ServerDataSource.getRepository(User);

  async userInfo(payload: any) {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      return { status: StatusCode.NOT_FOUND }
    }

    const info = plainToInstance(UserInfoResponse, user);

    const errors = await validate(info, {
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
      return { status: StatusCode.INTERNAL_SERVER_ERROR, errors: errors }
    }

    return { status: StatusCode.OK, user: info }
  }
}