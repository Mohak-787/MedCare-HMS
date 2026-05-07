import { Entity, Column, OneToOne, Index, OneToMany } from "typeorm";
import { Auth } from "./auth.entity";
import { Gender, UserRole } from "../constants/index.constant";
import { Base } from "./base.entity";

@Entity("users")
@Index(["email"])
@Index(["phone"])
export class User extends Base {
  @Column({ name: "fullName", type: "varchar" })
  fullName: string;

  @Column({ name: "email", type: "varchar", unique: true })
  email: string;

  @Column({ name: "phone", type: "varchar", unique: true })
  phone: string;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column({ type: "boolean", default: false })
  isVerified: boolean;

  @Column({ type: "varchar" })
  address: string;

  @Column({ type: "varchar", nullable: true })
  createdBy?: string;

  @Column({ type: "varchar", nullable: true })
  profilePicture?: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @OneToOne(() => Auth, (auth) => auth.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  auth: Auth;
}