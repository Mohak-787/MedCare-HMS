import { User } from "../../entities/user.entity";
import { Auth } from "../../entities/auth.entity";
import { StatusCode } from "../../constants/statusCode.constant";
import ServerDataSource from "../../configs/db.config";
import { OtpPurpose } from "../../constants/otp.constant";
import { hashIt, compareIt } from "../../utils/hash";

export class OtpService {
  private userRepository = ServerDataSource.getRepository(User);
  private authRepository = ServerDataSource.getRepository(Auth);

  async verifyOtp(data: any) {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      relations: ['auth']
    });

    if (!user) {
      return { status: StatusCode.NOT_FOUND }
    }

    if (!user.auth
      || !user.auth.otpHash
      || !user.auth.otpExpiry
      || user.auth.otpExpiry < new Date()
      || !user.auth.otpPurpose
    ) {
      return { status: StatusCode.BAD_REQUEST }
    }

    const isOtpMatch = await compareIt(data.otp, user.auth.otpHash);

    if (!isOtpMatch) {
      return { status: StatusCode.SESSION_EXPIRED }
    }

    switch (user.auth.otpPurpose) {
      case OtpPurpose.SIGNUP:
        user.isVerified = true;
        await this.userRepository.save(user);

        return { status: StatusCode.OK };

      case OtpPurpose.FORGOT_PASSWORD:
        // Todo issue temp token for reset password access
        
        return { status: StatusCode.OK, tempToken: null }

      default:
        return { status: StatusCode.INTERNAL_SERVER_ERROR }
    }
  }

  async resendOtp(data: any) {

  }

  async sendOtp() {

  }
}
