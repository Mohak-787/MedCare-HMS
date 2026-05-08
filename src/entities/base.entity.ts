import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert
} from "typeorm";
import { generateUuid } from "../utils/generateUuid";

export abstract class Base extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @BeforeInsert()
  setId() {
    this.id = generateUuid();
  }
}