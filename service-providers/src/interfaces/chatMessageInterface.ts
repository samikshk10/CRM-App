import * as Sequelize from 'sequelize';
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from '.';
import { MessageTypeEnum, MessageCategoryEnum, DirectionEnum } from '@src/enums';
import { OwnerExtendInterface } from './ownerInterface';

export interface InputChatMessageInterface extends OwnerExtendInterface {
  chatSessionId: number;
  senderId: number;
  content: string;
  direction:DirectionEnum;
  messageType: MessageTypeEnum;
}

export interface ChatMessageInterface extends ModelTimestampExtend, InputChatMessageInterface {
  id: Sequelize.CreationOptional<number>;
  timestamp: Date;
}

export interface ChatMessageModelInterface
  extends Sequelize.Model<ChatMessageInterface, Partial<InputChatMessageInterface>>,
    ChatMessageInterface {}

export interface ArgsChatMessageInterface extends CursorPaginationOrderSearchExtend {
  chatSessionId?: number;
  senderId?: number;
}
