import axios from "axios";
import { GraphQLError } from "graphql";
import {
  FacebookGetMessageInterface,
  FacebookMessageInterface,
  FacebookSendMessageInterface,
  FacebookSendMessageResponseInterface,
  InputFacebookWebhookMessageInterface,
  MessagesResponseInterface,
  OutputFacebookWebhookMessageInterface,
} from "@src/interfaces";
import { facebook } from "@src/config";

class FacebookMessage {
  private pageId: string | undefined;
  private pageAccessToken: string | undefined;
  private conversationId: string | undefined;
  constructor({ pageId, pageAccessToken, conversationId }: FacebookMessageInterface) {
    this.pageId = pageId;
    this.pageAccessToken = pageAccessToken;
    this.conversationId = conversationId;
  }

  async sendMessage(input: FacebookSendMessageInterface): Promise<FacebookSendMessageResponseInterface> {
    const messageSendResponse = await axios.post(
      `${facebook.baseUrl}/v13.0/${this.pageId}/messages?access_token=${this.pageAccessToken}`,
      {
        messaging_type: "RESPONSE",
        recipient: {
          id: input.recipient.id,
        },
        message: {
          text: input.message.text,
        },
      },
    );
    if (messageSendResponse.data.error) {
      throw new GraphQLError(messageSendResponse.data.error.message, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: messageSendResponse.data.error.message,
          attribute: "message",
        },
      });
    }
    return messageSendResponse.data;
  }

  async getMessages(input: FacebookGetMessageInterface): Promise<MessagesResponseInterface> {
    const messageSendResponse = await axios.get(
      `${facebook.baseUrl}/v13.0/${this.conversationId}/messages?fields=id,message,to,from&access_token=${
        this.pageAccessToken
      }&after=${input.after ? "" : input.after}&before=${input.before ? "" : input.before}`,
    );
    if (messageSendResponse.data.error) {
      throw new GraphQLError(messageSendResponse.data.error.message, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: messageSendResponse.data.error.message,
          attribute: "message",
        },
      });
    }
    const data: MessagesResponseInterface["data"] = messageSendResponse.data.data;
    const paging: MessagesResponseInterface["paging"] = messageSendResponse.data.paging;
    return {
      data,
      paging,
    };
  }

  async MessageWebhook(input: InputFacebookWebhookMessageInterface): Promise<OutputFacebookWebhookMessageInterface> {
    return {
      contactId: input.contactId,
      message: input.message,
      result: input.result,
    };
  }
}

export { FacebookMessage };
