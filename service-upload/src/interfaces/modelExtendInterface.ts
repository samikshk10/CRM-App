import * as Sequelize from "sequelize";

export interface ModelTimestampExtend {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
