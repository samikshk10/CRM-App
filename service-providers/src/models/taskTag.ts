import * as Sequelize from "sequelize";
import { TaskTagModelInterface } from "../interfaces";
import { Database } from "../config";

const sequelize = Database.sequelize;
const TaskTag = sequelize.define<TaskTagModelInterface>(
  "providers_task_tags",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tagId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_tags",
        key: "id",
      },
      field: "tag_id",
    },
    taskId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_tasks",
        key: "id",
      },
      field: "task_id",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
  }
);
export default TaskTag;
