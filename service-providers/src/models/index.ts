import User from "./user";
import Note from "./note";
import Milestone from "./milestone";
import Deal from "./deal";
import { ContactTag, Contact, Tag, TaskTag, SubTask, Task, Media, Pipeline } from "./relation";
import Platform from "./platform";
import ContactCredential from "./userSocialCredential";
import UserSocialCredential from "./userSocialCredential";
import ContactSocialIdentities from "./contactSocialIdentities"
import ContactActivityTimeline from "./contactActivityTimeline";
import ChatSession from "./chatSession";
import ChatMessage from "./chatMessage";
import ContactAttachment from "./contactAttachments";
import TaskAttachment from "./taskAttachments";
import TaskType from "./tasktype";

const Model = {
  Contact,
  User,
  Note,
  Tag,
  Pipeline,
  Milestone,
  Deal,
  ContactTag,
  Task,
  TaskType,
  SubTask,
  Platform,
  ContactCredential,
  TaskTag,
  UserSocialCredential,
  ContactSocialIdentities,
  ContactActivityTimeline,
  ChatSession,
  ChatMessage,
  Media,
  ContactAttachment,
  TaskAttachment,
};

export default Model;
