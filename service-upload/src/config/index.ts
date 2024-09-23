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
   * HOST URL
   */
  hostUrl = process.env.HOST_URL as string,
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
  /**
   * Allowed Origins
   */
  corsWhitelist = [
    "http://localhost:8004",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://api.develop.soniccrm.com",
    "https://app.develop.soniccrm.com"
  ] as string[],
  /** Pagination */
  pgMinLimit = 10,
  pgMaxLimit = 100,
  /** Order */
  defaultOrder = "id",
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
  },
  /**
   * S3 Bucket
   */

  s3Bucket = {
    name: process.env.AWS_S3_BUCKET_NAME!,
    assetsName: process.env.AWS_S3_BUCKET_NAME_ASSET!,
    region: process.env.AWS_S3_BUCKET_REGION!,
    assetsRegion: process.env.AWS_S3_BUCKET_REGION_ASSET!,
    accessKey: process.env.AWS_S3_BUCKET_ACCESS_KEY!,
    accessSecret: process.env.AWS_S3_BUCKET_ACCESS_SECRET!,
  } as {
    name: string;
    assetsName: string;
    region: string;
    assetsRegion: string;
    accessKey: string;
    accessSecret: string;
  };

export * from "./instance";
