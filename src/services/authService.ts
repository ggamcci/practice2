import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { prisma } from "../db";
import { authConfig } from "../config/auth";

const SALT_ROUNDS = 10;

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function createTokens(userId: number, role: string) {
  const accessSecret: Secret = authConfig.accessSecret;
  const refreshSecret: Secret = authConfig.refreshSecret;

  const accessTokenOptions: SignOptions = {
    expiresIn: authConfig.accessExpiresIn as SignOptions["expiresIn"],
  };

  const refreshTokenOptions: SignOptions = {
    expiresIn: authConfig.refreshExpiresIn as SignOptions["expiresIn"],
  };

  const accessToken = jwt.sign(
    { userId, role },
    accessSecret,
    accessTokenOptions
  );

  const refreshToken = jwt.sign(
    { userId, role },
    refreshSecret,
    refreshTokenOptions
  );

  return { accessToken, refreshToken };
}

export const authService = {
  async signup(data: SignupInput) {
    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      const err: any = new Error("Email already in use");
      err.status = 409;
      throw err;
    }

    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: hashed,
        userRole: "USER",
      },
    });

    const { accessToken, refreshToken } = createTokens(user.id, user.userRole);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.userRole,
      },
      accessToken,
      refreshToken,
    };
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.isActive) {
      const err: any = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) {
      const err: any = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const { accessToken, refreshToken } = createTokens(user.id, user.userRole);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.userRole,
      },
      accessToken,
      refreshToken,
    };
  },

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        authConfig.refreshSecret as Secret
      ) as { userId: number; role: string };

      const { accessToken, refreshToken: newRefresh } = createTokens(
        payload.userId,
        payload.role
      );

      return { accessToken, refreshToken: newRefresh };
    } catch {
      const err: any = new Error("Invalid refresh token");
      err.status = 401;
      throw err;
    }
  },
};
