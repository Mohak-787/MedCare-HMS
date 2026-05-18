import { Expose } from "class-transformer";
import { Gender, UserRole } from "../../constants/index.constant";

export class UserInfoResponse {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  gender: Gender;

  @Expose()
  isVerified: boolean;

  @Expose()
  address: string;

  @Expose()
  profilePicture?: string;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}