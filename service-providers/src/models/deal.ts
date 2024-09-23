import * as Sequelize from 'sequelize';

import { Database } from '@src/config';
import { DealModelInterface } from '@src/interfaces';
import Milestone from './milestone';
import Contact from './contact';
import User from './user';
const sequelize = Database.sequelize;

const Deal = sequelize.define<DealModelInterface>(
  'providers_deals',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contactId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'providers_contacts',
        key: 'id',
      },
      field: 'contact_id',
    },
    company: {
      type: Sequelize.STRING,
    },
    value: {
      type: Sequelize.INTEGER,
    },
    pipelineId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'providers_pipelines',
        key: 'id',
      },
      field: 'pipeline_id',
    },
    milestoneId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'providers_milestones',
        key: 'id',
      },
      field: 'milestone_id',
    },
    closingDate: {
      type: Sequelize.DATE,
    },
    description: {
      type: Sequelize.STRING,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'authenticator_users',
        key: 'id',
      },
      field: 'owner_id',
    },
    assigneeId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'authenticator_users',
        key: 'id',
      },
      field: 'assignee_id',
    },
    reporterId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'authenticator_users',
        key: 'id',
      },
      field: 'reporter_id',
    },
    decision: {
      type: Sequelize.JSONB,
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
        unique: false,
        name: 'providers_deals_owner_id_pipeline_id_milestone_id',
        fields: ['ownerId','pipelineId', 'milestoneId'],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
);
Milestone.hasMany(Deal, {
  foreignKey: 'milestoneId',
  as: 'deals',
});
Deal.belongsTo(Milestone, {
  foreignKey: 'milestoneId',
  as: 'milestone',
});

Contact.hasMany(Deal, {
  foreignKey: 'contactId',
  as: 'deals',
});

Deal.belongsTo(Contact, {
  foreignKey: 'contactId',
  as: 'contact',
});

Deal.belongsTo(User,{
  foreignKey: "ownerId",
  as: 'owner'
})

User.hasMany(Deal,{
  foreignKey: 'ownerId',
  as: 'deals'
})
export default Deal;
