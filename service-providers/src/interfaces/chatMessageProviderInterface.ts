import * as Sequelize from "sequelize";
import { CursorPaginationOrderSearchExtend, ModelTimestampExtend } from ".";

export interface InputChatMessageProviderInterface {
  platform: string;
  contactId: string;
  message: string;
}

export interface InputFacebookWebhookMessageInterface {
  contactId: number;
  message: string;
  result: {
    first_name: string;
    last_name: string;
    profile_pic: string;
    gender: string;
  };
}

export interface OutputFacebookWebhookMessageInterface {
  contactId: number;
  message: string;
  result: Record<string, string>;
}

export interface InputWhatsappWebhookMessageInterface {
  phoneId: number;
  message: string;
}

export interface OutputWhatsappWebhookMessageInterface {
  phoneId: number;
  message: string;
  // result: Record<string, string>;
}
export interface OutputChatMessageInterface {
  recipient_id: string;
  message_id: string;
}

export interface ChatMessageFacebookInterface extends ModelTimestampExtend, InputChatMessageProviderInterface {
  id: Sequelize.CreationOptional<number>;
}

export interface FacebookModelInterface
  extends Sequelize.Model<ChatMessageFacebookInterface, Partial<InputChatMessageProviderInterface>>,
  ChatMessageFacebookInterface { }

export interface ArgsFacebookMessageInterface extends CursorPaginationOrderSearchExtend { }
