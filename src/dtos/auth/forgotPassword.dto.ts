import {
  IsEmail,
  IsNotEmpty,
  Matches
} from "class-validator";

import { Transform } from "class-transformer";
import { regex } from "../../constants/regex.constant";

export class forgotPasswordDto {
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  @Matches(regex.emailRegex, {
    message: "Email must be valid"
  })
  @IsNotEmpty({ message: "Email is requrired" })
  email: string;
}