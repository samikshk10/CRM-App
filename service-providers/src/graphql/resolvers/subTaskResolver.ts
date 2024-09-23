import { SubTaskService } from "@src/services";
import { GraphQLResolveInfo } from "graphql";
import { ContextInterface, InputSubTaskInterface } from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { createSubTaskValidator, updateSubTaskValidator } from "@src/validators";
import { SuccessResponse } from "@src/helpers";

export const SubTaskResolver = {
  Query: {
    subTasks: async (parent: ParentNode, args: {}, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const subTasks = await new SubTaskService().findAll();
      return SuccessResponse.send({
        message: "SubTasks fetched sucessfully",
        data: subTasks,
      });
    },

    subTask: async (parent: ParentNode, args: { id: number }, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const subTask = await new SubTaskService().findByPK(args.id);
      return SuccessResponse.send({
        message: "SubTask fetched Successfully",
        data: subTask,
      });
    },
  },

  Mutation: {
    createSubTask: async (
      parent: ParentNode,
      args: { input: InputSubTaskInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(createSubTaskValidator, args.input);

      const subTask = await new SubTaskService().create({
        ...args.input,
        ownerId: user.ownerId!,
      });
      return SuccessResponse.send({
        message: "SubTask created successfully",
        data: subTask,
      });
    },

    updateSubTask: async (
      parent: ParentNode,
      args: { id: number; input: InputSubTaskInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(updateSubTaskValidator, args.input);
      const updatedSubTask = await new SubTaskService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "SubTask updated successfully",
        data: updatedSubTask,
      });
    },

    deleteSubTask: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const subTask = await new SubTaskService().deleteOne(args.id);
      return SuccessResponse.send({
        message: "SubTask deleted successfully",
      });
    },
  },
};
