import { CookieOptions } from "express";

export const accessMaxage = 5 * 60 * 1000;
export const refreshMaxage = 7 * 24 * 60 * 60 * 1000;
export const tempMaxage = 3 * 60 * 1000;

export const getCookieOptions = (maxAge?: number): CookieOptions => ({
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  ...(maxAge !== undefined ? { maxAge } : {}),
});