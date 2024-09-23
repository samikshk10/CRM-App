import { GraphQLResolveInfo } from "graphql";
import { ContextInterface, InputTaskTagInterface, TaskTagInterface } from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { SuccessResponse } from "@src/helpers";
import { assignTagToTask } from "@src/validators";
import { TaskTagService } from "@src/services";

export const TaskTagResolvers = {
  Mutation: {
    assignTagToTask: async (
      parent: ParentNode,
      args: { input: InputTaskTagInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(assignTagToTask, args.input);
      const data = await new TaskTagService().create(args.input);
      return SuccessResponse.send({
        message: "Task Tag assigned successfully",
        data,
      });
    },
  },
};
