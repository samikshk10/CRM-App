import { GraphQLResolveInfo } from "graphql";
import {
  ContextInterface,
  InputTaskAttachmentInterface,
} from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { uploadTaskAttachment } from "@src/validators";
import { TaskAttachmentService } from "@src/services";
import { SuccessResponse } from "@src/helpers";

export const taskAttachmentResolvers = {
  Mutation: {
    uploadTaskAttachment: async (
      parent: ParentNode,
      args: { input: InputTaskAttachmentInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Guard.grant(context.user);
      Validator.check(uploadTaskAttachment, args.input);
      await new TaskAttachmentService().create(args.input);
      return SuccessResponse.send({
        message: "File uploded succesfully",
      });
    },
  },

  Query: {
    taskAttachments: async (
      parent: ParentNode,
      args: { taskId: number },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Guard.grant(context.user);
      const data = await new TaskAttachmentService().findAll(args.taskId);
      return SuccessResponse.send({
        message: "Attachments fetched Successfully",
        edges: data,
      });
    },
  },
};