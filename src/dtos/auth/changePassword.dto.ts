import {
  IsString,
  IsNotEmpty,
  MaxLength,
} from "class-validator";

import { Transform } from "class-transformer";
import { ResetPasswordDto } from "./resetPassword.dto";

export class ChangePasswordDto extends ResetPasswordDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: "Old password is required" })
  @MaxLength(100, { message: "Too long" })
  oldPassword: string;
}