import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsEnum,
  Length,
  MinLength,
  MaxLength,
} from "class-validator";

import { Transform } from "class-transformer";

import { UserRole, Gender } from "../../constants/index.constant";
import { regex } from "../../constants/regex.constant";

export class SignupDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(3, 50)
  @IsNotEmpty({ message: "Full name is required", groups: ["create"] })
  @IsOptional({ groups: ["update"] })
  fullName?: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  @IsNotEmpty({ message: "Email is required", groups: ["create"] })
  @IsOptional({ groups: ["update"] })
  email?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @Matches(regex.phoneRegex, {
    message: "Phone must be valid",
    groups: ["create", "update"],
  })
  @IsNotEmpty({ message: "Phone is required", groups: ["create"] })
  @IsOptional({ groups: ["update"] })
  phone?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(3, 255)
  @IsNotEmpty({ message: "Address is required", groups: ["create"] })
  @IsOptional({ groups: ["update"] })
  address?: string;

  @IsEnum(Gender, {
    message: "Invalid gender",
    groups: ["create", "update"],
  })
  @IsNotEmpty({
    message: "Gender cannot be empty",
    groups: ["create"],
  })
  @IsOptional({ groups: ["update"] })
  gender: Gender;

  @IsEnum(UserRole, {
    message: "Invalid role type",
    groups: ["create", "update"],
  })
  @IsOptional({ groups: ["create", "update"] })
  role?: UserRole;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(regex.passwordRegex, {
    message:
      "Password must include at least one letter, one number, and one special character.",
    groups: ["create", "update"],
  })
  @IsNotEmpty({ message: "Password is required", groups: ["create"] })
  @IsOptional({ groups: ["update"] })
  password: string;
}