import * as Sequelize from "sequelize";

import { Database } from "../config";
import User from "./user";
import Role from "./role";
import { UsersRolesModelInterface } from "../interfaces";

const sequelize = Database.sequelize;

const UsersRoles = sequelize.define<UsersRolesModelInterface>(
  "users_roles",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      field: "user_id",
    },
    roleId: {
      type: Sequelize.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      field: "role_id",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "authenticator_users_roles",
    freezeTableName: true,
  }
);

User.belongsToMany(Role, {
  through: "authenticator_users_roles",
  sourceKey: "id",
  targetKey: "id",
  as: "users",
});

Role.belongsToMany(User, {
  through: "authenticator_users_roles",
  sourceKey: "id",
  targetKey: "id",
  as: "roles",
});

export default UsersRoles;
