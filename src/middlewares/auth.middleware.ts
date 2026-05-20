import { UserRole } from "../constants/index.constant";
import { ApiError } from "../utils/apiError";
import { verifyToken, generateAccessToken } from "../utils/token";
import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../constants/statusCode.constant";
import env from "../constants/env.constant";
import ServerDataSource from "../configs/db.config";
import { User } from "../entities/user.entity";
import { accessMaxage } from "../constants/token.constant";
import { asyncHandler } from "../utils/asyncHandler";

interface UserPayload {
  id: string;
  role: UserRole;
  authId: string;
}

interface TempPayload {
  email: string;
  purpose: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      payload?: TempPayload
    }
  }
}

export const authenticate = (allowedRoles: UserRole[] = []) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Sign in required");
    }

    let user;

    if (refreshToken) {
      let decodedRefresh: any;
      try {
        decodedRefresh = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);
      } catch (error) {
        throw new ApiError(StatusCode.SESSION_EXPIRED, "Session expired, please login again");
      }

      user = await ServerDataSource.getRepository(User).findOne({
        where: { id: decodedRefresh.id },
        relations: ["auth"],
      });

      if (
        !user ||
        !user.auth ||
        !user.auth.refreshToken ||
        user.auth.refreshToken !== refreshToken ||
        !user.auth.refreshTokenExpiresAt ||
        Date.now() > user.auth.refreshTokenExpiresAt.getTime()
      ) {
        throw new ApiError(StatusCode.SESSION_EXPIRED, "Invalid or expired session");
      }
    } else {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Sign in required");
    }

    let decoded: UserPayload | null = null;

    if (accessToken) {
      try {
        decoded = verifyToken(accessToken, env.JWT_ACCESS_SECRET) as UserPayload;
      } catch (error) {
        decoded = null;
      }
    }

    if (!decoded && refreshToken && user) {
      accessToken = generateAccessToken(user.id, user.role, user.auth.id);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: accessMaxage,
      });

      decoded = {
        id: user.id,
        role: user.role,
        authId: user.auth.id,
      };
    }

    if (!decoded) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Authentication failed");
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      throw new ApiError(StatusCode.FORBIDDEN, "Access denied: Unauthorized role");
    }

    req.user = decoded;
    next();
  });

export const tempAuthenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tempToken = req.cookies?.tempToken;

    if (!tempToken) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "OTP verification required");
    }

    const decoded: any = verifyToken(tempToken, env.JWT_TEMP_SECRET);

    if (!decoded) {
      throw new ApiError(StatusCode.SESSION_EXPIRED, "Session expired");
    }

    (req as any).payload = decoded;
    next();
  }
);