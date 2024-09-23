import * as Sequelize from "sequelize";

import { Database } from "../config";
import { TaskTypeModelInterface } from "@src/interfaces";

const sequelize = Database.sequelize;
const TaskType = sequelize.define<TaskTypeModelInterface>(
  "tasktype",
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
    label: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "providers_task_types",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        name: 'providers_task_types_owner_id_slug',
        fields: ['owner_id', 'slug'],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
);

export default TaskType;
