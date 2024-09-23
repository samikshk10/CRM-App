import { GraphQLResolveInfo } from "graphql";
import { Guard, Validator } from "@src/middlewares";
import { InputPlatformInterface, ContextInterface, PlatformInterface } from "@src/interfaces";
import { CreatePlatform, UpdatePlatform, DeletePlatform } from "@src/validators";
import { PlatformService } from "@src/services";
import { SuccessResponse } from "@src/helpers";
export const platformResolver = {
  Query: {
    platform: async (parent: ParentNode, args: { id: number }, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const platform = await new PlatformService().findByPk(args.id);
      return SuccessResponse.send({
        message: "Platform found Successfully",
        data: platform,
      });
    },
    platforms: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const platforms = await new PlatformService().findAll();
      return SuccessResponse.send({
        message: "Platforms found Successfully",
        edges: platforms,
      });
    },
  },
  Mutation: {
    createPlatform: async (
      parent: ParentNode,
      args: { input: InputPlatformInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(CreatePlatform, args.input);
      const createPlatform = await new PlatformService().create(args.input);
      return SuccessResponse.send({
        message: "Platform created Successfully",
        data: createPlatform,
      });
    },
    updatePlatform: async (
      parent: ParentNode,
      args: { id: number; input: Partial<InputPlatformInterface> },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(UpdatePlatform, args.input);
      const updatedPlatform = await new PlatformService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Platform updated Successfully",
        data: updatedPlatform,
      });
    },
    deletePlatform: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(DeletePlatform, args);
      await new PlatformService().deleteOne(args.id);
      return SuccessResponse.send({
        message: "Platform deleted Successfully",
      });
    },
  },
};
