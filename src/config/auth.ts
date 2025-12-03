import dotenv from "dotenv";

dotenv.config();

export const authConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || "access_secret",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh_secret",
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};
