import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { InputChatMessageInterface, ContextInterface, ArgsChatMessageInterface } from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { createChatMessage, updateChatMessage } from "@src/validators";
import { ChatMessageService } from "@src/services";
import { CursorPagination, SuccessResponse } from "@src/helpers";

export const chatMessageResolver: any = {
  Mutation: {
    createChatMessage: async (
      parent: any,
      args: { input: InputChatMessageInterface },
      context: any,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      args.input.ownerId = user.ownerId!;
      Validator.check(createChatMessage, args.input);
      const data = await new ChatMessageService().create(args.input);
      return SuccessResponse.send({
        message: "Chat message created Successfully",
        data: data,
      });
    },
    updateChatMessage: async (
      parent: ParentNode,
      args: {
        id: number;
        input: InputChatMessageInterface;
      },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(updateChatMessage, args.input);
      const data = await new ChatMessageService().updateOne(args.id, args.input);
      if (!data) {
        throw new GraphQLError("Chat message not found");
      }
      return SuccessResponse.send({
        message: "Chat message updated Successfully",
        data: data,
      });
    },
    deleteChatMessage: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const data = await new ChatMessageService().delete(args.id);
      if (!data) {
        throw new GraphQLError("Chat message not found");
      }
      return SuccessResponse.send({
        message: "Chat message deleted Successfully",
      });
    },
  },
  Query: {
    chatMessages: async (
      parent: ParentNode,
      args: ArgsChatMessageInterface,
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const { cursor, limit, order, sort, cursorOrder, cursorSort, query } = CursorPagination.getCursorQuery({
        before: args.before,
        after: args.after,
        first: args.first,
        last: args.last,
      });

      const { rows, cursorCount, count } = await new ChatMessageService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorOrder,
        cursorSort,
        query,
        senderId: args.senderId,
        chatSessionId: args.chatSessionId,
      });

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: "Chat messages list is successfully fetched.",
        edges: data,
        pageInfo,
      });
    },
  },
};
