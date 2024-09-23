import * as Sequelize from "sequelize";
import { ContactAttachmentModelInterface } from "@src/interfaces";
import { Database } from "@src/config";
import Media from "./mediaModel";
import Contact from "./contact";

const sequelize = Database.sequelize;
const ContactAttachment = sequelize.define<ContactAttachmentModelInterface>(
  "providers_contact_attachments",
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
    contactId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "providers_contacts",
        key: "id",
      },
      field: "contact_id",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
  }
);

ContactAttachment.belongsTo(Contact, {
  foreignKey: "contact_id",
  as: "contact",
});

ContactAttachment.belongsTo(Media, {
  foreignKey: "attachment_id",
  as: "attachment",
});

export default ContactAttachment;