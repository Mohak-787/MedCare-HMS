import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Base } from "./base.entity";

@Entity("auths")
export class Auth extends Base {
  @OneToOne(() => User, (user) => user.auth, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column("jsonb", { nullable: true })
  passwordHistory?: { passwordHash: string; createdAt: Date }[];

  @Column({ nullable: true })
  otpHash?: string;

  @Column({ nullable: true })
  otpExpiry?: Date;

  @Column({ nullable: true })
  refreshTokenHash?: string;

  @Column({ nullable: true })
  refreshTokenExpiresAt?: Date;
}