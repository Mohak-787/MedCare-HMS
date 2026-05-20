import { StatusCode } from "../../constants/statusCode.constant";
import ServerDataSource from "../../configs/db.config";
import { User } from "../../entities/user.entity";
import { Auth } from "../../entities/auth.entity";
import { hashIt, compareIt } from "../../utils/hash";
import { SignupDto } from "../../dtos/auth/signup.dto";
import { UserRole } from "../../constants/index.constant";
import { SigninDto } from "../../dtos/auth/signin.dto";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { refreshMaxage } from "../../constants/token.constant";
import { ChangePasswordDto } from "../../dtos/auth/changePassword.dto";
import { ResetPasswordDto } from "../../dtos/auth/resetPassword.dto";
import { ForgotPasswordDto } from "../../dtos/auth/forgotPassword.dto";
import { OtpService } from "../otp/otp.service";
import { OtpPurpose } from "../../constants/otp.constant";

export class AuthService {
  private userRepository = ServerDataSource.getRepository(User);
  private authRepository = ServerDataSource.getRepository(Auth);
  private otpSerivce = new OtpService();

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

    await this.otpSerivce.sendOtp(OtpPurpose.SIGNUP, user.email, user.auth);

    return { status: StatusCode.CREATED };
  }

  async signin(data: SigninDto) {
    const user = await this.userRepository.findOne({
      where: [{ email: data.credential }, { phone: data.credential }],
      relations: ['auth']
    });

    if (!user) {
      return { status: StatusCode.UNAUTHORIZED }
    }

    if (!user.isVerified) {
      await this.otpSerivce.sendOtp(OtpPurpose.SIGNUP, user.email, user.auth)
      return { status: StatusCode.BAD_REQUEST }
    }

    const isPasswordCorrect = await compareIt(data.password, user.auth.passwordHash as string);

    if (!isPasswordCorrect) {
      return { status: StatusCode.UNAUTHORIZED }
    }

    let refreshToken = user.auth.refreshToken;
    const refreshTokenExpiresAt = user.auth.refreshTokenExpiresAt;

    if (
      !refreshToken ||
      !refreshTokenExpiresAt ||
      refreshTokenExpiresAt < new Date()
    ) {
      refreshToken = generateRefreshToken(user.id);

      user.auth.refreshToken = refreshToken;
      user.auth.refreshTokenExpiresAt = new Date(
        Date.now() + refreshMaxage
      );

      await this.authRepository.save(user.auth);
    }

    const accessToken = generateAccessToken(user.id, user.role, user.auth.id);

    return {
      status: StatusCode.OK,
      refreshToken,
      accessToken
    }
  }

  async changePassword(data: ChangePasswordDto, payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ["auth"]
    });

    if (!user) {
      return { status: StatusCode.NOT_FOUND }
    }

    const isPasswordCorrect = await compareIt(data.oldPassword, user.auth.passwordHash as string);

    if (!isPasswordCorrect) {
      return { status: StatusCode.BAD_REQUEST }
    }

    const passwordHash = await hashIt(data.newPassword, 12);

    user.auth.passwordHash = passwordHash;
    user.auth.refreshToken = null;
    user.auth.refreshTokenExpiresAt = null;

    await this.authRepository.save(user.auth);

    return { status: StatusCode.OK }
  }

  async resetPassword(data: ResetPasswordDto, payload: any) {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
      relations: ['auth']
    })

    if (!user) {
      return { status: StatusCode.NOT_FOUND }
    }

    const passwordHash = await hashIt(data.newPassword, 12);

    user.auth.passwordHash = passwordHash;
    user.auth.refreshToken = null;
    user.auth.refreshTokenExpiresAt = null;

    await this.authRepository.save(user.auth);
    return { status: StatusCode.OK }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      relations: ['auth']
    });

    if (!user) {
      return { status: StatusCode.NOT_FOUND }
    }

    await this.otpSerivce.sendOtp(OtpPurpose.FORGOT_PASSWORD, user.email, user.auth);
    return { status: StatusCode.OK }
  }

  async logout(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['auth']
    });

    if (!user) {
      return { status: StatusCode.NOT_FOUND }
    }

    user.auth.refreshToken = null;
    user.auth.refreshTokenExpiresAt = null;

    await this.authRepository.save(user.auth);

    return { status: StatusCode.OK }
  }

  async logoutAllDevice(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['auth']
    });

    if (!user) {
      return { status: StatusCode.NOT_FOUND }
    }

    user.auth.refreshToken = null;
    user.auth.refreshTokenExpiresAt = null;

    await this.authRepository.save(user.auth);

    return { status: StatusCode.OK }
  }

}