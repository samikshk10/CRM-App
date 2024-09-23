import { CursorPagination, SuccessResponse } from "@src/helpers";
import { ArgsTaskInterface, ContextInterface, TaskInterface, UpdatedTaskInterface } from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { TaskService } from "@src/services";
import { createTask, updateTask } from "@src/validators";
import { GraphQLResolveInfo } from "graphql";

export const taskResolver: any = {
  Query: {
    tasks: async (parent: ParentNode, args: ArgsTaskInterface, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const { cursor, limit, order, sort, cursorOrder, cursorSort, query } = CursorPagination.getCursorQuery({
        before: args.before,
        after: args.after,
        first: args.first,
        last: args.last,
      });
      const { rows, cursorCount, count } = await new TaskService().findAndCountAll({
        cursor,
        limit,
        order,
        sort,
        cursorOrder,
        cursorSort,
        query,
      });

      const { data, pageInfo } = CursorPagination.cursor({
        cursorCount,
        count,
        rows,
        cursor,
        limit,
      });
      return SuccessResponse.send({
        message: "Task list is successfully fetched.",
        edges: data,
        pageInfo,
      });
    },

    task: async (parent: ParentNode, args: { id: number }, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const task = await new TaskService().findByPK(args.id);
      return SuccessResponse.send({
        message: "Task fetched successfully.",
        data: task,
      });
    },
  },
  Mutation: {
    createTask: async (
      parent: ParentNode,
      args: { input: TaskInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(createTask, args.input);
      args.input.ownerId = user.ownerId!;
      args.input.createdById = user.id;
      args.input.updatedById = user.id;
      const data = await new TaskService().create(args.input);
      return SuccessResponse.send({
        message: "Task created Successfully",
        data: data,
      });
    },

    updateTask: async (
      parent: ParentNode,
      args: { id: number; input: UpdatedTaskInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(updateTask, args.input);
      args.input.updatedById = user.id;
      const data = await new TaskService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Task updated Successfully",
        data: data,
      });
    },

    deleteTask: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      await new TaskService().delete(args.id);
      return SuccessResponse.send({
        message: "Task Deleted Successfully",
      });
    },

    toggleTaskStar: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const data = await new TaskService().toggleStar(args.id);
      return SuccessResponse.send({
        message: `Task ${data.starred ? "starred" : "unstarred"}  Successfully`,
        data,
      });
    },
  },
};
