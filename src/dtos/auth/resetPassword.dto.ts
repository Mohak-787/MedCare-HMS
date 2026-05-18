import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf
} from "class-validator";

import { Transform } from "class-transformer";
import { regex } from "../../constants/regex.constant";

export class ResetPasswordDto {
  @Transform(({ value }) => value?.trim)
  @IsString()
  @MinLength(6, { message: "Password must be atleast 6 characters long" })
  @MaxLength(100, { message: "Password is too long" })
  @Matches(regex.passwordRegex, {
    message:
      "New password must include at least one letter, one number, and one special character.",
  })
  @IsNotEmpty({ message: "New password is required" })
  newPassword: string;

  @Transform(({ value }) => value?.trim)
  @IsString()
  @ValidateIf((o) => o.newPassword === o.confirmPassword, {
    message: "Passwords donot match"
  })
  confirmPassword: string;
}