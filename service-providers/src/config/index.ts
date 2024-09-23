import * as dotenv from "dotenv";
import * as sequelize from "sequelize";

import { EnvironmentEnum, SortEnum } from "@src/enums";

const mustExist = <T>(value: T | undefined, name: string): T => {
  if (!value) {
    console.error(`Missing Config: ${name} !!!`);
    process.exit(1);
  }
  return value;
};

dotenv.config();

export const port = mustExist(+process.env.PORT!, "PORT") as number,
  appName = mustExist(process.env.APP_NAME!, "APP_NAME") as string,
  playground = mustExist(process.env.GRAPHIQL === "true", "GRAPHIQL") as boolean,
  environment = process.env.ENVIRONMENT || (EnvironmentEnum.DEVELOPMENT as EnvironmentEnum),
  db = {
    username: mustExist(process.env.DB_USER!, "DB_USER"),
    password: mustExist(process.env.DB_PASSWORD!, "DB_PASSWORD"),
    name: mustExist(process.env.DB_NAME!, "DB_NAME"),
    host: mustExist(process.env.DB_HOST!, "DB_HOST"),
    dialect: mustExist(process.env.DB_DIALECT!, "DB_DIALECT"),
    port: mustExist(+process.env.DB_PORT!, "DB_PORT"),
    logging: false,
    timezone: "utc",
  } as {
    username: string;
    password: string;
    name: string;
    host: string;
    dialect: sequelize.Dialect;
    port: number;
    logging: boolean;
    timezone: string;
  },
  redisClient = {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
  } as { host: string; port: number; password: string },
  corsWhitelist = [] as string[],
  //assign rank
  highestRank = 0,
  lowestRank = {
    won: 99,
    lost: 100,
  },
  // pagination
  pgMinLimit = 10,
  pgMaxLimit = 100,
  defaultCursor = "id",
  defaultSort = SortEnum.DESC,
  // AWS cognito
  cognito = {
    userPoolId: mustExist(process.env.AWS_COGNITO_USER_POOL_ID!, "AWS_COGNITO_USER_POOL_ID"),
    clientId: mustExist(process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!, "AWS_COGNITO_USER_POOL_CLIENT_ID"),
    region: mustExist(process.env.AWS_COGNITO_REGION!, "AWS_COGNITO_REGION"),
    accessKeyId: mustExist(process.env.AWS_COGNITO_ACCESS_KEY_ID!, "AWS_COGNITO_ACCESS_KEY_ID"),
    secretAccessKey: mustExist(process.env.AWS_COGNITO_SECRET_ACCESS_KEY!, "AWS_COGNITO_SECRET_ACCESS_KEY"),
  } as {
    userPoolId: string;
    clientId: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  },
  // Providers base url
  facebook = {
    baseUrl: mustExist(process.env.FACEBOOK_BASE_URL!, "FACEBOOK_BASE_URL"),
  } as {
    baseUrl: string;
  };
export * from "./instance";

export * from "./ioRedis";
