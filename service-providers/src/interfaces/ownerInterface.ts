import * as Sequelize from "sequelize";

export interface OwnerExtendInterface {
  ownerId: Sequelize.CreationOptional<number>;
}
