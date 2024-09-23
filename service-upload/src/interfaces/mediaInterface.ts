import * as Sequelize from "sequelize";
import { ModelTimestampExtend, PaginationOrderSearchExtend } from ".";

export interface InputMediaInterface {
  originalname: string;
  size: number;
  key: string;
  mimetype: string;
  url: string;
  log: Express.MulterS3.File;
}

export interface MediaInterface
  extends ModelTimestampExtend,
    InputMediaInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface MediaModelInterface
  extends Sequelize.Model<MediaInterface, Partial<InputMediaInterface>>,
    MediaInterface {}

export interface ArgsMediaInterface extends PaginationOrderSearchExtend {}
