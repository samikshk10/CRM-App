import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

import { s3Bucket } from "../config";
import { Ksuid } from "../helpers";
import fs from 'fs'
export class Multer {
  public multer: multer.Multer;
  public diskStorage: multer.Multer;
  private s3Client: S3Client;

  public constructor(private s3?: { name?: string; region: string }) {
    this.s3Client = new S3Client({
      region: this.s3?.region ?? s3Bucket.region,
      credentials: {
        accessKeyId: s3Bucket.accessKey,
        secretAccessKey: s3Bucket.accessSecret,
      },
    });

    this.multer = multer({
      limits: {
        fileSize: 10 * 1024 * 1024, // in bytes
      },
      storage: multerS3({
        s3: this.s3Client,
        bucket: this.s3?.name ?? s3Bucket.name,
        acl: "public-read",
        metadata: (req, file, cb) => {
          cb(null, file);
        },
        key: (req, file, cb) => {
          cb(null, `${Ksuid.randomSync()}-${file.originalname}`);
        },
      }),
    });

    this.diskStorage = multer({
      limits: {
        fileSize: 10 * 1024 * 1024, // in bytes
      },
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          let path = "public/service-upload"
          if(!fs.existsSync(path)){
            fs.mkdirSync(path, {recursive: true})
          }
          cb(null, path);
        },
        filename: (req, file, cb) => {
          cb(null, `${Ksuid.randomSync()}-${file.originalname}`);
        },
      }),
    });
  }
}
