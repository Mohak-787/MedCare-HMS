import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Base } from "./base.entity";
import { OtpPurpose } from "../constants/otp.constant";

@Entity("auths")
export class Auth extends Base {
  @OneToOne(() => User, (user) => user.auth, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column({ type: "varchar", nullable: true })
  passwordHash?: string;

  @Column("jsonb", { nullable: true })
  passwordHistory?: { passwordHash: string; createdAt: Date }[];

  @Column({ type: "varchar", nullable: true })
  otpHash?: string | null;

  @Column({ type: "timestamp", nullable: true })
  otpExpiry?: Date | null;

  @Column({ nullable: true, type: "enum", enum: OtpPurpose })
  otpPurpose?: string | null

  @Column({ type: "varchar", nullable: true })
  refreshToken?: string | null;

  @Column({ type: "timestamp", nullable: true })
  refreshTokenExpiresAt?: Date | null;
}