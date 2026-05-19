import {
  IsString,
  IsNumberString,
  Length,
  IsNotEmpty
} from "class-validator";

import { Transform } from "class-transformer";
import { ForgotPasswordDto } from "../auth/forgotPassword.dto";

export class VerifyOtpDto extends ForgotPasswordDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNumberString({}, { message: "OTP must be a number" })
  @Length(6, 6, { message: "OTP must be 6 digits" })
  @IsNotEmpty({ message: "OTP is required" })
  otp: string;
}

export class ResendOtpDto extends ForgotPasswordDto {

}