import * as Sequelize from "sequelize";
import { Database } from "@src/config";
import { TaskModelInterface } from "@src/interfaces";
import Contact from "./contact";
import TaskType from "./tasktype";

const sequelize = Database.sequelize;

const Task = sequelize.define<TaskModelInterface>(
  "tasks",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    contactId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_contacts",
        key: "id",
      },
      field: "contact_id",
    },
    tagId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "providers_tags",
        key: "id",
      },
      field: "tag_id",
    },
    typeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "providers_task_types",
        key: "id",
      },
      field: "type_id",
    },
    assigneeId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "assignee_id",
    },
    dueDate: {
      type: Sequelize.DATE,
    },
    reminderDate: {
      type: Sequelize.DATE,
    },
    completedDate: {
      type: Sequelize.DATE,
    },
    parentId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_tasks",
        key: "id",
      },
      field: "parent_id",
    },
    level: {
      type: Sequelize.INTEGER,
    },
    pipelineId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_pipelines",
        key: "id",
      },

      field: "pipeline_id",
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "owner_id",
    },
    reporterId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "reporter_id",
    },
    starred: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdById: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "created_by_id",
    },
    updatedById: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "updated_by_id",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "providers_tasks",
    freezeTableName: true,
    indexes: [
      {
        unique: false,
        name: "providers_tasks_owner_id",
        fields: ["owner_id"],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);

Contact.hasMany(Task, {
  foreignKey: "contactId",
  as: "tasks",
});

Task.belongsTo(Contact, {
  foreignKey: "contactId",
  as: "contact",
});

TaskType.hasMany(Task, {
  foreignKey: "typeId",
  as: "tasks",
});

Task.belongsTo(TaskType, {
  foreignKey: "typeId",
  as: "taskType",
});
export default Task;
