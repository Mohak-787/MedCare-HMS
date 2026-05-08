import jwt from "jsonwebtoken";
import env  from "../constants/env.constant";
import { UserRole } from "../constants/index.constant";

export function generateAccessToken(
  userId: string,
  role: UserRole,
  tokenId: string
) {
  return jwt.sign({ id: userId, role, tokenId }, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}