import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from ".";

export interface InputUsersRolesInterface {
  userId: number;
  roleId: number;
}

export interface UsersRolesInterface
  extends ModelTimestampExtend,
    InputUsersRolesInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface UsersRolesModelInterface
  extends Sequelize.Model<
      UsersRolesInterface,
      Partial<InputUsersRolesInterface>
    >,
    UsersRolesInterface {}
