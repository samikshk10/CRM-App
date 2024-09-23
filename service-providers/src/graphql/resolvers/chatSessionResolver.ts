import { GraphQLResolveInfo } from "graphql";
import { ArgsChatSessionsInterface, InputChatSessionsInterface } from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { CursorPagination, SuccessResponse } from "@src/helpers";
import { ContextInterface } from "@src/interfaces";
import { ChatSessionService } from "@src/services";
import { createChatSession, updateChatSession } from "@src/validators";

export const chatSessionResolvers: any = {
  Mutation: {
    createChatSession: async (
      parent: ParentNode,
      args: { input: InputChatSessionsInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      args.input.ownerId = user.ownerId!;
      Validator.check(createChatSession, args.input);
      args.input.assigneeId = user.ownerId!;
      args.input.createdById = user.id;
      args.input.updatedById = user.id;
      const data = await new ChatSessionService().create(args.input);
      return SuccessResponse.send({
        message: "Chat session created Successfully",
        data: data,
      });
    },

    updateChatSession: async (
      parent: ParentNode,
      args: { id: number; input: Partial<InputChatSessionsInterface> },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(updateChatSession, args.input);
      args.input.updatedById = user.id;
      const data = await new ChatSessionService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Chat session updated Successfully",
        data: data,
      });
    },

    deleteChatSession: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      await new ChatSessionService().deleteOne(args.id);
      return SuccessResponse.send({
        message: "Chat session Deleted successfully",
      });
    },
  },

  Query: {
    chatSession: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const data = await new ChatSessionService().findByPk(args.id);
      return SuccessResponse.send({
        message: "Chat session fetched successfully",
        data: data,
      });
    },
    chatSessions: async (
      parent: ParentNode,
      args: ArgsChatSessionsInterface,
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const { status } = args;
      const { cursor, limit, order, sort, cursorOrder, cursorSort, query } = CursorPagination.getCursorQuery({
        before: args.before,
        after: args.after,
        first: args.first,
        last: args.last,
      });

      const { rows, cursorCount, count } = await new ChatSessionService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorOrder,
        cursorSort,
        query,
        status,
      });

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });

      return SuccessResponse.send({
        message: "Chat session list is successfully fetched.",
        edges: data,
        pageInfo,
      });
    },
  },
};
