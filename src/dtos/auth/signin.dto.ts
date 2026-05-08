import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength
} from "class-validator";

import { Transform } from "class-transformer";

export class SigninDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: "Email or Phone is required" })
  @MaxLength(100, { message: "Too long" })
  credential: string  // email or phone

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: "Password is required " })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  @MaxLength(100, { message: "Password is too long" })
  password: string
}