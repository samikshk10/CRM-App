import * as Sequelize from "sequelize";

import { Database } from "../config";
import { RoleModelInterface } from "@src/interfaces";

const sequelize = Database.sequelize;

const Role = sequelize.define<RoleModelInterface>(
  "roles",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "roles",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        name: "roles_slug",
        fields: ["slug"],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
);

export default Role;
