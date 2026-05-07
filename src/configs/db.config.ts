import "reflect-metadata";
import { DataSource } from "typeorm";
import env from "../constants/env.constant"

const ServerDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  entities: [],
  migrations: ["src/migrations/**/*.ts"]
});

export default ServerDataSource;