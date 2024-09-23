import * as Sequelize from 'sequelize';
import { ContactTagModelInterface } from '../interfaces';
import { Database } from '../config';
import Model from '@src/models';
const sequelize = Database.sequelize;
const ContactTag = sequelize.define<ContactTagModelInterface>(
  'providers_contact_tags',
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
        model: 'providers_tags',
        key: 'id',
      },
      field: 'tag_id',
    },
    contactId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'providers_contacts',
        key: 'id',
      },
      field: 'contact_id',
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
  },
);

export default ContactTag;
