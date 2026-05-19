import dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  GOOGLE_USER,
  GOOGLE_APP_PASSWORD
} = process.env;

if (
  !PORT ||
  !DB_HOST ||
  !DB_PORT ||
  !DB_USERNAME ||
  !DB_PASSWORD ||
  !DB_NAME ||
  !JWT_ACCESS_SECRET ||
  !JWT_REFRESH_SECRET ||
  !GOOGLE_USER ||
  !GOOGLE_APP_PASSWORD
) {
  throw new Error("Missing required environment variables");
}

const env = {
  PORT,
  DB_HOST,
  DB_PORT: Number(DB_PORT) || 5432,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  GOOGLE_APP_PASSWORD,
  GOOGLE_USER
};

export default env;