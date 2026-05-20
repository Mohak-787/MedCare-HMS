import { User } from "../../entities/user.entity";
import { Auth } from "../../entities/auth.entity";
import { StatusCode } from "../../constants/statusCode.constant";
import ServerDataSource from "../../configs/db.config";
import { OtpPurpose } from "../../constants/otp.constant";
import { hashIt, compareIt } from "../../utils/hash";
import { ResendOtpDto, VerifyOtpDto } from "../../dtos/otp/otp.dto";
import { generateOtp } from "../../utils/generateOtp";
import { otpHtmlTemplate, otpTextTemplate } from "../../templates/otp.template";
import { sendEmail } from "../../configs/mail.config";
import { generateTempToken } from "../../utils/token";

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
      return { status: StatusCode.SESSION_EXPIRED }
    }

    const isOtpMatch = await compareIt(data.otp, user.auth.otpHash);

    if (!isOtpMatch) {
      return { status: StatusCode.BAD_REQUEST }
    }

    switch (user.auth.otpPurpose) {
      case OtpPurpose.SIGNUP:
        user.isVerified = true;
        user.auth.otpHash = undefined;
        user.auth.otpExpiry = undefined;
        user.auth.otpPurpose = undefined;

        await this.userRepository.save(user);
        await this.authRepository.save(user.auth);

        return { status: StatusCode.OK };

      case OtpPurpose.FORGOT_PASSWORD:
        const tempToken = generateTempToken(user.email, OtpPurpose.FORGOT_PASSWORD);
        return { status: StatusCode.OK, tempToken }

      default:
        return { status: StatusCode.INTERNAL_SERVER_ERROR }
    }
  }

  async resendOtp(data: ResendOtpDto) {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      relations: ['auth']
    });

    if (!user) {
      return { status: StatusCode.NOT_FOUND }
    }

    if (!user.auth.otpPurpose) {
      return { status: StatusCode.BAD_REQUEST }
    }

    const result: any = await this.sendOtp(user.auth.otpPurpose as OtpPurpose, data.email, user.auth);

    if (result.status !== StatusCode.OK) {
      return { status: StatusCode.INTERNAL_SERVER_ERROR }
    }

    return { status: result.status }
  }

  async sendOtp(purpose: OtpPurpose, email: string, existingAuth?: Auth) {
    let auth = existingAuth;

    if (!auth) {
      const foundAuth = await this.authRepository.findOne({
        where: { user: { email } }
      });

      if (!foundAuth) {
        return { status: StatusCode.NOT_FOUND };
      }

      auth = foundAuth;
    }

    const otp = generateOtp();
    const otpHash = await hashIt(otp, 5);
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
    const html = otpHtmlTemplate(otp, purpose);
    const text = otpTextTemplate(otp, purpose);

    auth.otpHash = otpHash;
    auth.otpExpiry = otpExpiry;
    auth.otpPurpose = purpose;

    await this.authRepository.save(auth);

    await sendEmail(email, "Verify OTP", text, html);

    return { status: StatusCode.OK };
  }
}

