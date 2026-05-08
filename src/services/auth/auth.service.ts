import { StatusCode } from "../../constants/statusCode.constant";
import ServerDataSource from "../../configs/db.config";
import { User } from "../../entities/user.entity";
import { Auth } from "../../entities/auth.entity";
import { hashIt, compareIt } from "../../utils/hash";
import { SignupDto } from "../../dtos/auth/signup.dto";
import { UserRole } from "../../constants/index.constant";

export class AuthService {
  private userRepository = ServerDataSource.getRepository(User);

  async signup(data: SignupDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
      relations: ['auth']
    });

    if (existingUser) {
      return { status: StatusCode.ALREADY_EXIST }
    }

    const user = this.userRepository.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      gender: data.gender,
      role: UserRole.PATIENT
    });

    const auth = new Auth();
    auth.passwordHash = await hashIt(data.password, 12);

    user.auth = auth;
    await this.userRepository.save(user);

    return {status: StatusCode.CREATED};
  }
}