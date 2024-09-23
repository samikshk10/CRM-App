import { GraphQLResolveInfo } from "graphql";
import {
  ContextInterface,
  TaskTypeInterface,
  InputTaskTypeInterface,
  CursorPaginationOrderSearchExtend,
} from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { createTaskType, deleteTaskType, updateTaskType } from "@src/validators";
import { CursorPagination, SuccessResponse } from "@src/helpers";
import { TaskTypeService } from "@src/services";
import TaskType from "@src/models";

export const taskTypeResolver: any = {
  Query: {
    taskTypes: async (
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
      const { rows, cursorCount, count } = await new TaskTypeService().findAndCountAll({
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
        message: "TaskType list is successfully fetched.",
        edges: data,
        pageInfo,
      });
    },
    taskType: async (parent: ParentNode, args: { id: number }, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const tasktype = await new TaskTypeService().findByPK(args.id);
      return SuccessResponse.send({
        message: "TaskType fetched successfully",
        data: tasktype,
      });
    },
  },
  Mutation: {
    createTaskType: async (
      parent: ParentNode,
      args: { input: InputTaskTypeInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(createTaskType, args.input);
      args.input.ownerId = user.ownerId!;
      const data = await new TaskTypeService().create(args.input);

      return SuccessResponse.send({
        message: "TaskType created Successfully",
        data,
      });
    },
    updateTaskType: async (
      parent: ParentNode,
      args: { id: number; input: InputTaskTypeInterface },
      contextValue: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(contextValue.user);
      Validator.check(updateTaskType, args.input);
      const data = await new TaskTypeService().updateOne(args.id, args.input);

      return SuccessResponse.send({
        message: "TaskType is successfully updated.",
        data: data,
      });
    },
    deleteTaskType: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(deleteTaskType, args);

      await new TaskTypeService().deleteOne(args.id);
      return SuccessResponse.send({
        message: "TaskType Deleted Successfully",
      });
    },
  },
};
