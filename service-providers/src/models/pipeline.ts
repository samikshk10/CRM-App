import * as Sequelize from "sequelize";
import { Database } from "@src/config";
import { PipelineModelInterface } from "@src/interfaces";
import Task from "./task";
const sequelize = Database.sequelize;
const Pipeline = sequelize.define<PipelineModelInterface>(
  "providers_pipelines",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    parentId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_pipelines",
        key: "id",
      },
      field: "parent_id",
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },

      field: "owner_id",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "providers_pipelines",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        name: "providers_pipelines_owner_id_slug",
        fields: ["owner_id", "slug"],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);

Pipeline.hasMany(Pipeline, {
  foreignKey: "parentId",
  as: "children",
});

Pipeline.belongsTo(Pipeline, {
  foreignKey: "parentId",
  as: "parent",
});

Pipeline.hasMany(Task, {
  foreignKey: "pipelineId",
  as: "tasks",
});
Task.belongsTo(Pipeline, {
  foreignKey: "pipelineId",
  as: "pipeline",
});
export default Pipeline;
