import * as Sequelize from "sequelize";
import { Database } from "@src/config";
import { MessageCategoryEnum, MessageTypeEnum,DirectionEnum } from "@src/enums";
import ChatSession from "./chatSession";
import { ChatMessageModelInterface } from "@src/interfaces";

const sequelize = Database.sequelize;
const ChatMessage = sequelize.define<ChatMessageModelInterface>(
  "providers_chat_messages",
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
    chatSessionId:{
      type: Sequelize.INTEGER,
      references: {
        model: "providers_chat_sessions",
        key: "id",
      },
      field: "chat_session_id",
    },
    senderId: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "sender_id",
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    direction: {
      type: Sequelize.ENUM(DirectionEnum.INCOMING, DirectionEnum.OUTGOING),
      allowNull: false,
    },
    messageType: {
      type: Sequelize.ENUM(MessageTypeEnum.INTERNAL, MessageTypeEnum.EXTERNAL),
      allowNull: false,
      field: "message_type",
    },
    timestamp: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: "timestamp",
      allowNull: false,
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
        name: "providers_chat_messages_chat_session_id_sender_id_owner_id",
        fields: ["chat_session_id", "sender_id", "owner_id"],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);
ChatSession.hasMany(ChatMessage, {
  foreignKey: "chatSessionId",
  sourceKey: "id",
  as: "chatMessages",
});
ChatMessage.belongsTo(ChatSession, {
  foreignKey: "chatSessionId",
  targetKey: "id",
  as: "chatSession",
});

export default ChatMessage;
