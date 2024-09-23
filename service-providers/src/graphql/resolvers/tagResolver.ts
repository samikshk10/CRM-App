import { GraphQLResolveInfo } from "graphql";
import { ContextInterface, CursorPaginationOrderSearchExtend, TagInterface } from "@src/interfaces";
import { createTag, deleteTag, updateTag } from "@src/validators";
import { Guard, Validator } from "@src/middlewares";
import { TagService } from "@src/services";
import { CursorPagination, SuccessResponse } from "@src/helpers";

export const tagResolvers: any = {
  Query: {
    tags: async (
      parent: ParentNode,
      args: CursorPaginationOrderSearchExtend,
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const { cursor, limit } = CursorPagination.getCursorQuery({
        before: args.before,
        after: args.after,
        first: args.first,
        last: args.last,
      });
      const { rows, cursorCount, count } = await new TagService().findAndCountAll({
        cursor,
        limit,
      });

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });
      return SuccessResponse.send({
        message: "Tag list is successfully fetched.",
        edges: data,
        pageInfo,
      });
    },

    tag: async (parent: ParentNode, args: { id: number }, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const tag = await new TagService().findByPK(args.id);
      return SuccessResponse.send({
        message: "Tag fetched successfully",
        data: tag,
      });
    },
  },
  Mutation: {
    createTag: async (
      parent: ParentNode,
      args: { input: TagInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(createTag, args.input);
      args.input.ownerId = user.ownerId!;
      const data = await new TagService().create(args.input);

      return SuccessResponse.send({
        message: "Tag created Successfully",
        data,
      });
    },
    updateTag: async (
      parent: ParentNode,
      args: { id: number; input: TagInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(updateTag, args.input);

      const data = await new TagService().updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: "Tag updated Successfully",
        data,
      });
    },

    deleteTag: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(deleteTag, args);

      await new TagService().delete(args.id);
      return SuccessResponse.send({
        message: "Tag Deleted Successfully",
      });
    },
  },
};
