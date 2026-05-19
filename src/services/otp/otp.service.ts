import { User } from "../../entities/user.entity";
import { Auth } from "../../entities/auth.entity";
import { StatusCode } from "../../constants/statusCode.constant";
import ServerDataSource from "../../configs/db.config";
import { OtpPurpose } from "../../constants/otp.constant";
import { hashIt, compareIt } from "../../utils/hash";
import { VerifyOtpDto } from "../../dtos/otp/otp.dto";

export class OtpService {
  private userRepository = ServerDataSource.getRepository(User);
  private authRepository = ServerDataSource.getRepository(Auth);

  async verifyOtp(data: VerifyOtpDto) {
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
        user.auth.otpHash = undefined;
        user.auth.otpExpiry = undefined;
        user.auth.otpPurpose = undefined;

        await this.userRepository.save(user);
        await this.authRepository.save(user.auth);

        return { status: StatusCode.OK, purpose: OtpPurpose.SIGNUP };

      case OtpPurpose.FORGOT_PASSWORD:
        // Todo issue temp token for reset password access

        return { status: StatusCode.OK, tempToken: null, purpose: OtpPurpose.FORGOT_PASSWORD }

      default:
        return { status: StatusCode.INTERNAL_SERVER_ERROR }
    }
  }

  async resendOtp(data: any) {

  }

  async sendOtp() {

  }
}
