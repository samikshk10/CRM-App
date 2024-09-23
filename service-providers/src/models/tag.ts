import * as Sequelize from 'sequelize';

import { Database } from '../config';
import { TagModelInterface } from '../interfaces';
const sequelize = Database.sequelize;
const Tag = sequelize.define<TagModelInterface>(
  'tags',
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
        model: 'authenticator_users',
        key: 'id',
      },
      field: 'owner_id',
    },
    name: {
      type: Sequelize.STRING(50),
    },
    slug: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    color: {
      type: Sequelize.STRING(7),
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: 'providers_tags',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        name: 'providers_tags_owner_id_slug',
        fields: ['owner_id', 'slug'],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);

export default Tag;
