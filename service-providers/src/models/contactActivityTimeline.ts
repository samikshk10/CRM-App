import * as Sequelize from "sequelize";
import { Database } from "@src/config";
import { ContactActivityTypeEnum } from "@src/enums";
import { ContactActivityTimelineModelInterface } from "@src/interfaces/contactActivityTimelineInterface";
import Contact from './contact';
import User from "./user";
import Note from "./note";
import Task from "./task";
import ChatSession from "./chatSession";

const sequelize = Database.sequelize;
const ContactActivityTimeline = sequelize.define<ContactActivityTimelineModelInterface>(
  "providers_contacts_activity_timeline",
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
      field: "contact_id"
    },
    activityById: {
      type: Sequelize.INTEGER,
      references: {
        model: "authenticator_users",
        key: "id",
      },
      field: "activity_by_id",
    },
    referenceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "reference_id"
    },
    referenceRelation: {
      type: Sequelize.STRING,
      allowNull:false,
      field: "reference_relation"
    },
    type: {
      type: Sequelize.ENUM(
        ContactActivityTypeEnum.CONTACT_ADDED,
        ContactActivityTypeEnum.CONTACT_ASSIGNED,
        ContactActivityTypeEnum.TASK_CREATED,
        ContactActivityTypeEnum.NOTE_ADDED,
        ContactActivityTypeEnum.PIPELINE_CREATED,
        ContactActivityTypeEnum.MAIL_SENT,
      ),
    },
  }, 
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
  }
);

ContactActivityTimeline.belongsTo(Contact, {
  foreignKey: "contactId",
  as: "contact",
});

ContactActivityTimeline.belongsTo(User, {
  foreignKey: "activityById",
  as: "activityBy",
});

ContactActivityTimeline.belongsTo(Note, {
  foreignKey: "referenceId",
  as: "note",
  constraints: false,
});

ContactActivityTimeline.belongsTo(Task, {
  foreignKey: "referenceId",
  as: "task",
  constraints: false,
});

ContactActivityTimeline.belongsTo(ChatSession, {
  foreignKey: "referenceId",
  as: "chatSession",
  constraints: false,
});


ContactActivityTimeline.addHook("afterFind", findResult => {
  if (!Array.isArray(findResult)) findResult = [findResult as ContactActivityTimelineModelInterface ];
  for (const instance of findResult) {
    if (instance.referenceRelation === "providers_tasks" && instance.task !== undefined) {
      delete instance.note;
      delete instance.dataValues.note;
      delete instance.chatSession;
      delete instance.dataValues.chatSession;
    } else if (instance.referenceRelation === "providers_contact_notes" && instance.note !== undefined) {
      delete instance.chatSession;
      delete instance.dataValues.chatSession;
      delete instance.task;
      delete instance.dataValues.task;
    } else if (instance.referenceRelation === "providers_chat_sessions" && instance.chatSession !== undefined) {
      delete instance.task;
      delete instance.dataValues.task;
      delete instance.note;
      delete instance.dataValues.note;
    }
  }
});

export default ContactActivityTimeline;