import { User } from "../../entities/user.entity";
import { UserInfoResponse } from "../../dtos/user/userInfo.dto";
import ServerDataSource from "../../configs/db.config";
import { StatusCode } from "../../constants/statusCode.constant";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { SignupDto } from "../../dtos/auth/signup.dto";

export class UserService {
  private userRepository = ServerDataSource.getRepository(User);

  async userInfo(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      return { status: StatusCode.NOT_FOUND }
    }

    const info = plainToInstance(UserInfoResponse, user, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(info, {
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
      return { status: StatusCode.INTERNAL_SERVER_ERROR, errors: errors }
    }

    return { status: StatusCode.OK, user: info }
  }

  async updateUser(data: SignupDto, payload: any) {
    const result = await this.userRepository.update({ id: payload.id }, data);

    if (result.affected === 0) {
      return { status: StatusCode.NOT_FOUND };
    }

    return { status: StatusCode.OK }
  }

  async deleteUser(payload: any) {
    const result = await this.userRepository.delete({ id: payload.id });

    if (result.affected === 0) {
      return { status: StatusCode.NOT_FOUND };
    }

    return { status: StatusCode.OK }
  }
}