import * as Sequelize from "sequelize";

import { Database } from "@src/config";
import { ContactModelInterface } from "@src/interfaces";
import { SourceEnum, StatusEnum } from "@src/enums";
import Model from "@src/models";
const sequelize = Database.sequelize;
const Contact = sequelize.define<ContactModelInterface>(
  "providers_contacts",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "owner_id",
    },
    name: {
      type: Sequelize.STRING(100),
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: Sequelize.STRING(100),
    },
    company: {
      type: Sequelize.STRING(50),
    },
    companyDomain: {
      type: Sequelize.STRING(50),
      field: "company_domain",
    },
    contactNumber: {
      type: Sequelize.STRING(20),
      field: "contact_number",
    },
    status: {
      type: Sequelize.ENUM(StatusEnum.WON, StatusEnum.InConversation, StatusEnum.InNegotiation, StatusEnum.LOST),
    },
    source: {
      type: Sequelize.ENUM(
        SourceEnum.Facebook,
        SourceEnum.FromContacts,
        SourceEnum.Instagram,
        SourceEnum.WhatsApp,
        SourceEnum.Manually,
      ),
      defaultValue: SourceEnum.Manually,
    },
    profilePictureId: {
      type: Sequelize.INTEGER,
      field: "profile_picture_id",
      references: {
        model: "upload_medias",
        key: "id",
      },
    },
    createdById: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "created_by_id",
    },
    updatedById: {
      type: Sequelize.INTEGER,
      allowNull: true,
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
        unique: true,
        name: "providers_contacts_owner_id_email",
        fields: ["ownerId", "email"],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);

export default Contact;
