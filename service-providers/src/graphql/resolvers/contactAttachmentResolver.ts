import { GraphQLResolveInfo } from "graphql";
import {
  ContextInterface,
  InputContactAttachmentInterface,
} from "../../interfaces";
import { Guard, Validator } from "@src/middlewares";
import { uploadAttachment } from "@src/validators";
import { ContactAttachmentService } from "@src/services";
import { SuccessResponse } from "@src/helpers";

export const contactAttachmentResolvers = {
  Mutation: {
    uploadContactAttachment: async (
      parent: ParentNode,
      args: { input: InputContactAttachmentInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Guard.grant(context.user);
      Validator.check(uploadAttachment, args.input);
      await new ContactAttachmentService().create(args.input);
      return SuccessResponse.send({
        message: "File uploded succesfully",
      });
    },
  },

  Query: {
    contactAttachments: async (
      parent: ParentNode,
      args: { contactId: number },
      context: ContextInterface,
      info: GraphQLResolveInfo
    ) => {
      Guard.grant(context.user);
      const data = await new ContactAttachmentService().findAll(args.contactId);
      return SuccessResponse.send({
        message: "Attachments fetched Successfully",
        edges: data,
      });
    },
  },
};