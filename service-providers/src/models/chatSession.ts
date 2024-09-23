import * as Sequelize from "sequelize";
import { Database } from "@src/config";
import { ChatSessionsModelInterface } from "@src/interfaces";
import { ChatsessionStatusEnum } from "@src/enums";
import Contact from "./contact";
import Note from "./note";
import User from "./user";

const sequelize = Database.sequelize;
const ChatSession = sequelize.define<ChatSessionsModelInterface>(
  "providers_chat_sessions",
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
    contactId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_contacts",
        key: "id",
      },
      field: "contact_id",
    },
    messagePlatformId: {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_platforms",
        key: "id",
      },
      field: "message_platform_id",
    },
    status: {
      type: Sequelize.ENUM(ChatsessionStatusEnum.OPEN, ChatsessionStatusEnum.CLOSED),
    },
    assigneeId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "assignee_id",
    },
    reporterId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "reporter_id",
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
        unique: true,
        name: "providers_chat_sessions_owner_id_contact_id_message_platform_id_status",
        fields: ["owner_id,contact_id,message_platform_id,status"],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);

Contact.hasMany(ChatSession, {
  foreignKey: "contactId",
  as: "chatSessions",
});

ChatSession.belongsTo(Contact, {
  foreignKey: "contactId",
  as: "contact",
});

ChatSession.hasMany(Note, {
  foreignKey: "chatSessionId",
  as: "notes",
});

Note.belongsTo(ChatSession, {
  foreignKey: "chatSessionId",
  as: "chatSessions",
});

ChatSession.belongsTo(User, {
  foreignKey: "assigneeId",
  as: "assignee",
});

export default ChatSession;
