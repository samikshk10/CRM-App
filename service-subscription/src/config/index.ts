import * as dotenv from "dotenv";
import * as sequelize from "sequelize";

import { EnvironmentEnum, SortEnum } from "../enums";

const mustExist = <T>(value: T | undefined, name: string): T => {
  if (!value) {
    console.error(`Missing Config: ${name} !!!`);
    process.exit(1);
  }
  return value;
};

dotenv.config();

/**
 * Your favorite port
 */
export const port = parseInt(process.env.PORT!) as number,
  /**
   * Application name
   */
  appName = process.env.APP_NAME! as string,
  /**
   * Graphql schema
   */
  playground = (process.env.GRAPHIQL === "true") as boolean,
  /**
   * Application mode (Set the environment to 'development' by default)
   */
  environment =
    process.env.ENVIRONMENT || (EnvironmentEnum.DEVELOPMENT as EnvironmentEnum),
  /**
   * Database Connection
   */
  db = {
    username: process.env.DB_USER! as string,
    password: process.env.DB_PASSWORD! as string,
    name: process.env.DB_NAME! as string,
    host: process.env.DB_HOST! as string,
    dialect: process.env.DB_DIALECT! as sequelize.Dialect,
    port: parseInt(process.env.DB_PORT!) as number,
    logging: false,
    timezone: "utc" as string,
  },
  redisClient = {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
  } as { host: string; port: number; password: string },
  /**
   * Allowed Origins
   */
  corsWhitelist = [] as string[],
  /** Pagination */
  pgMinLimit = 10,
  pgMaxLimit = 100,
  /** Order */
  defaultCursor = "id",
  defaultSort = SortEnum.DESC,
  // AWS cognito
  cognito = {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
    clientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!,
    region: process.env.AWS_COGNITO_REGION!,
    accessKeyId: process.env.AWS_COGNITO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_COGNITO_SECRET_ACCESS_KEY!,
  } as {
    userPoolId: string;
    clientId: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };

export * from "./instance";

export * from "./ioRedis";
