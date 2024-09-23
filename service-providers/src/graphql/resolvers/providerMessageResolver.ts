import slug from "slug";
import { GraphQLResolveInfo } from "graphql";
import {
  InputChatMessageProviderInterface,
  FacebookGetMessageInterface,
  ContextInterface,
  GetMessageInputInterface,
  FacebookSendMessageInterface,
  WhatsappSendMessageInterface,
} from "@src/interfaces";
import { SuccessResponse } from "@src/helpers";
import { Guard } from "@src/middlewares";
import { FacebookMessage } from "@src/providers";
import { SearchMessage } from "@src/helpers";
import Model from "@src/models";
import { ContactSocialIdentitiesRepository, PlatformRepository } from "@src/repositories";
import { WhatsappMessage } from "@src/providers/whatsapp";
export const providerMessageResolver = {
  Mutation: {
    sendMessage: async (
      parent: any,
      args: { input: InputChatMessageProviderInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const platformSlug = slug(args.input.platform);
      let chatMessage;
      switch (platformSlug) {
        case "facebook":
          const platformWithUserSocialCredential = await new PlatformRepository().findOne({
            where: {
              slug: platformSlug,
            },
            include: [
              {
                model: Model.UserSocialCredential,
                as: "userSocialCredential",
                attributes: ["credentials"],
              },
            ],
          });
          const pageAccessToken = platformWithUserSocialCredential.userSocialCredential?.credentials.pageAccessToken;
          const pageId = platformWithUserSocialCredential.userSocialCredential?.credentials.pageId;
          const contactSocialIdentities = await new ContactSocialIdentitiesRepository().findOne({
            where: {
              id: args.input.contactId,
            },
          });
          const senderId = contactSocialIdentities?.contactAccessId;
          const messageInput: FacebookSendMessageInterface = {
            recipient: {
              id: senderId,
            },
            message: {
              text: args.input.message,
            },
          };
          chatMessage = await new FacebookMessage({ pageId, pageAccessToken }).sendMessage(messageInput);
          return SuccessResponse.send({
            message: "Message sent successfully",
            data: {
              recipientId: chatMessage?.recipient_id,
              messageId: chatMessage?.message_id,
            },
          });
          break;
        case "whatsapp":
          const platformWithUserSocialCredentials = await new PlatformRepository().findOne({
            where: {
              slug: platformSlug,
            },
            include: [
              {
                model: Model.UserSocialCredential,
                as: "userSocialCredential",
                attributes: ["credentials"],
              },
            ],
          });
          const accessToken = platformWithUserSocialCredentials.userSocialCredential?.credentials?.accessToken!;

          const phoneId = platformWithUserSocialCredentials.userSocialCredential?.credentials?.phoneId!;
          const contactSocialIdentitiess = await new ContactSocialIdentitiesRepository().findOne({
            where: {
              id: args.input.contactId,
            },
          });
          const sendersId = contactSocialIdentitiess.contactAccessId;
          const messageInputs: WhatsappSendMessageInterface = {
            recipient: {
              id: sendersId,
            },
            message: {
              text: args.input.message,
            },
          };
          chatMessage = await new WhatsappMessage({ phoneId, accessToken }).sendMessage(messageInputs);
          const MessageId = chatMessage.messages[0].id;
          const ContactId = chatMessage.contacts[0].wa_id;
          return SuccessResponse.send({
            message: "Message sent successfully",
            data: {
              recipientId: ContactId,
              messageId: MessageId,
            },
          });
          break;

        default:
          break;
      }

    },
  },
  Query: {
    fetchMessage: async (parent: any, args: { input: GetMessageInputInterface }, context: ContextInterface) => {
      let hasNextPage;
      let hasPreviousPage;
      Guard.grant(context.user);
      const contactWithUserSocialCredential = await new ContactSocialIdentitiesRepository().findOne({
        where: {
          id: args.input.contactId,
        },
        include: [
          {
            model: Model.UserSocialCredential,
            as: "userSocialCredential",
            attributes: ["credentials"],
          },
        ],
      });
      const conversationId = contactWithUserSocialCredential.meta.conversationId;
      const pageAccessToken = contactWithUserSocialCredential?.userSocialCredential?.credentials.pageAccessToken;
      const senderId = contactWithUserSocialCredential.contactAccessId;
      const getMessageInput: FacebookGetMessageInterface = {
        senderId: senderId,
        after: args.input.after,
        before: args.input.before,
      };
      const chatMessage = await new FacebookMessage({ conversationId, pageAccessToken }).getMessages(getMessageInput);
      if (chatMessage.paging?.next) {
        hasNextPage = true;
      } else {
        hasNextPage = false;
      }
      if (chatMessage.paging?.previous) {
        hasPreviousPage = true;
      } else {
        hasPreviousPage = false;
      }

      const matchingMessage = await SearchMessage.searchMessage({
        response: chatMessage,
        searchKeyword: args.input.searchKeyword,
      });
      return SuccessResponse.send({
        message: "successfully fetched messages",
        edges: matchingMessage,
        pageInfo: {
          count: chatMessage.data.length,
          hasNextPage,
          hasPreviousPage,
          startCursor: chatMessage.paging?.cursors?.before,
          endCursor: chatMessage.paging?.cursors?.after,
        },
      });
    },
  },
};
