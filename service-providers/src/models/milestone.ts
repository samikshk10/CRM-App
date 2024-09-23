import * as Sequelize from "sequelize";

import { Database } from "@src/config";
import { MilestoneModelInterface } from "@src/interfaces";
import Pipeline from "./pipeline";
const sequelize = Database.sequelize;
const Milestone = sequelize.define<MilestoneModelInterface>(
  'providers_milestones',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    pipelineId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_pipelines",
        key: "id",
      },
      
      field: "pipeline_id",
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },

      field: "owner_id",
    },
    rank:{
      type: Sequelize.DECIMAL(10,8),
    }
  },
  
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        name: 'providers_milestones_owner_id_slug',
        fields: ['owner_id', 'slug'],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
);
Pipeline.hasMany(Milestone, {
  foreignKey: 'pipelineId',
  as: 'milestone',
});

Milestone.belongsTo(Pipeline, {
  foreignKey: "pipelineId",
  as: "pipeline",
});
export default Milestone;
