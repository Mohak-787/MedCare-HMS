import jwt from "jsonwebtoken";
import env from "../constants/env.constant";
import { UserRole } from "../constants/index.constant";

export function generateAccessToken(
  userId: string,
  role: UserRole,
  authId: string
) {
  return jwt.sign({ id: userId, role, authId }, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function generateTempToken(email: string, purpose: string) {
  return jwt.sign({ email, purpose }, env.JWT_TEMP_SECRET, { expiresIn: "3m" });
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret);
}