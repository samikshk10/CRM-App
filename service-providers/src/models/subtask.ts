import * as Sequelize from "sequelize";

import { Database } from "../config";
import { SubTaskModelInterface } from "@src/interfaces";
const sequelize = Database.sequelize;

const SubTask = sequelize.define<SubTaskModelInterface>(
  "subtask",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "owner_id",
    },
    taskId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_tasks",
        key: "id",
      },
      field: "task_id",
    },
    description: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    completed: {
      type: Sequelize.BOOLEAN,
    },
  },

  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "providers_sub_tasks",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        name: "providers_sub_tasks_owner_id",
        fields: ["owner_id"],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
);

export default SubTask;
