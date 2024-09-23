import { GraphQLResolveInfo, GraphQLError } from "graphql";
import { Guard, Validator } from "@src/middlewares";
import {
  InputUserSocialCredentialInterface,
  ContextInterface,
  UpdateUserSocialCredentialInterface,
} from "@src/interfaces";
import { CreateUserSocialCredential, UpdateUserSocialCredential, DeleteUserSocialCredential } from "@src/validators";
import { UserSocialCredentialService } from "@src/services";
import { SuccessResponse } from "@src/helpers";

export const userSocialCredentialResolvers = {
  Mutation: {
    createUserSocialCredential: async (
      parent: any,
      args: { input: InputUserSocialCredentialInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(CreateUserSocialCredential, args.input);
      args.input.ownerId = user.ownerId!;

      const createdCredential = await new UserSocialCredentialService().create(args.input);
      return SuccessResponse.send({
        message: "Credential created successfully",
        data: createdCredential,
      });
    },
    updateUserSocialCredential: async (
      parent: any,
      args: { id: number; input: UpdateUserSocialCredentialInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(UpdateUserSocialCredential, args.input);
      const credential = await new UserSocialCredentialService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Credential updated successfully",
        data: credential,
      });
    },
    deleteUserSocialCredential: async (
      parent: any,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      Validator.check(DeleteUserSocialCredential, args);
      await new UserSocialCredentialService().delete(args.id);
      return SuccessResponse.send({
        message: "Credential deleted successfully",
      });
    },

    subscribeWebhook: async (
      parent: any,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      const createdCredential = await new UserSocialCredentialService().SubscribeWebhook(args.id);
      if (!createdCredential) {
        throw new GraphQLError(`Credential ${args.id} does not exist!`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Credential ${args.id} does not exist!`,
            attribute: "id",
          },
        });
      }
      return SuccessResponse.send({
        message: "Credential verified successfully",
        data: createdCredential,
      });
    },
  },
  Query: {
    userSocialCredentials: async (
      parent: ParentNode,
      args: {},
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const credentials = await new UserSocialCredentialService().findAll();
      return SuccessResponse.send({
        message: "User Social Credentials fetched Sucessfully",
        edges: credentials,
      });
    },
  },
};
