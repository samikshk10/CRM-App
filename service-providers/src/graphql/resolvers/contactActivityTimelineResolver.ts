import { GraphQLResolveInfo } from "graphql";
import { ContextInterface, ArgsContactActivityTimelineInterface } from "../../interfaces";
import { Guard } from "@src/middlewares";
import { ContactActivityTimelineService } from "@src/services";
import { CursorPagination, SuccessResponse } from "@src/helpers";

export const contactActivityTimelineResolver = {
  Mutation: {},
  Query: {
    contactActivityTimelines: async (
      parent: ParentNode,
      args: ArgsContactActivityTimelineInterface,
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const { contactId, type } = args;

      const { cursor, limit, order, sort, cursorOrder, cursorSort } = CursorPagination.getCursorQuery({
        before: args.before,
        after: args.after,
        first: args.first,
        last: args.last,
      });

      const { rows, cursorCount, count } = await new ContactActivityTimelineService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorOrder,
        cursorSort,
        contactId,
        type,
      });

      const { edges, pageInfo } = CursorPagination.cursorV2({
        cursorCount,
        count,
        rows,
        cursor,
        cursorOrder: cursorOrder!,
        order,
      });

      return SuccessResponse.send({
        message: "Contact list is successfully fetched.",
        edges,
        pageInfo,
      });
    },
  },
};
