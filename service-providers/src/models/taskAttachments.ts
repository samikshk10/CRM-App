import * as Sequelize from "sequelize";
import { TaskAttachmentModelInterface } from "@src/interfaces";
import { Database } from "@src/config";
import Media from "./mediaModel";
import Task from "./task";

const sequelize = Database.sequelize;
const TaskAttachment = sequelize.define<TaskAttachmentModelInterface>(
  "providers_task_attachments",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    attachmentId: {
      type: Sequelize.INTEGER,
      allowNull:false,
      references: {
        model: "upload_medias",
        key: "id",
      },
      field: "attachment_id",
    },
    taskId: {
      type: Sequelize.INTEGER,
      allowNull: false,
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

TaskAttachment.belongsTo(Task, {
  foreignKey: "taskId",
  as: "task",
});

TaskAttachment.belongsTo(Media, {
  foreignKey: "attachmentId",
  as: "attachment",
});

Task.hasMany(TaskAttachment, {
  foreignKey: "taskId",
  as: "files",
});

export default TaskAttachment;