import { Expose } from "class-transformer";
import { Gender, UserRole } from "../../constants/index.constant";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDate,
} from "class-validator";

export class UserInfoResponse {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Expose()
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  isVerified: boolean;

  @Expose()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Expose()
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @Expose()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}