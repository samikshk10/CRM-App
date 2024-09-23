import { GraphQLResolveInfo } from "graphql";
import { Guard, Validator } from "@src/middlewares";
import { InputContactSocialIdentitiesInterface, ContextInterface } from "@src/interfaces";
import { UpdateContactSocialIdentities, DeleteContactSocialIdentities } from "@src/validators";
import { ContactSocialIdentitiesService } from "@src/services";
import { SuccessResponse } from "@src/helpers";
export const contactSocialIdentitiesResolvers = {
  Mutation: {
    updateContactSocialIdentities: async (
      parent: any,
      args: { id: number; input: InputContactSocialIdentitiesInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(UpdateContactSocialIdentities, args.input);
      const credential = await new ContactSocialIdentitiesService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Credential updated successfully",
        data: credential,
      });
    },
    deleteContactSocialIdentities: async (
      parent: any,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(DeleteContactSocialIdentities, args);
      await new ContactSocialIdentitiesService().delete(args.id);
      return SuccessResponse.send({
        message: "Credential deleted successfully",
      });
    },
  },
};
