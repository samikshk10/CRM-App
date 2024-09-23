import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";
import { ChatsessionStatusEnum } from "@src/enums";
import { OwnerExtendInterface } from "./ownerInterface";

export interface InputChatSessionsInterface extends OwnerExtendInterface {
  contactId: number;
  messagePlatformId: number;
  assigneeId: number;
  status: ChatsessionStatusEnum;
  reporterId: number;
  createdById: number;
  updatedById: number;
}

export interface ChatSessionsInterface extends ModelTimestampExtend, InputChatSessionsInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface ChatSessionsModelInterface
  extends Sequelize.Model<ChatSessionsInterface, Partial<InputChatSessionsInterface>>,
    ChatSessionsInterface {}

export interface ArgsChatSessionsInterface extends CursorPaginationOrderSearchExtend {
  status?: String;
}
