import { GraphQLResolveInfo } from "graphql";
import { ContextInterface, InputContactTagInterface } from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import { assignTagToContact, unassignTagToContact } from "@src/validators";
import { ContactTagService } from "@src/services";
import { SuccessResponse } from "@src/helpers";

export const contactTagResolvers = {
  Mutation: {
    assignTagToContact: async (
      parent: ParentNode,
      args: { input: InputContactTagInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(assignTagToContact, args.input);
      const data = await new ContactTagService().create(args.input);
      return SuccessResponse.send({
        message: "Contact Tag assigned successfully",
        data: data,
      });
    },

    unassignTagToContact: async (
      parent: ParentNode,
      args: { input: InputContactTagInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(unassignTagToContact, args.input);
      const { contactId, tagId } = args.input;
      await new ContactTagService().delete(contactId, tagId);
      return SuccessResponse.send({
        message: "Contact's Tag deleted successfully",
      });
    },
  },
};
