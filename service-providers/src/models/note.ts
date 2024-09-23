import * as Sequelize from "sequelize";

import { Database } from "@src/config";
import { ContactNoteModelInterface } from "./../interfaces";
import Contact from "./contact";

const sequelize = Database.sequelize;

const Note = sequelize.define<ContactNoteModelInterface>(
  "providers_contact_notes",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    contactId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_contacts",
        key: "id",
      },

      field: "contact_id",
    },
    description: {
      type: Sequelize.STRING,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "owner_id",
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
    freezeTableName: true,
    indexes: [
      {
        unique: false,
        name: "providers_contact_notes_contact_id",
        fields: ["contactId"],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);

Contact.hasMany(Note, {
  foreignKey: "contactId",
  as: "notes",
});

Note.belongsTo(Contact, {
  foreignKey: "contactId",
  as: "contact",
});

export default Note;
