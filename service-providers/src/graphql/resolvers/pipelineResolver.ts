import { GraphQLResolveInfo } from "graphql";
import { Guard, Validator } from "@src/middlewares";
import {
  InputPipelineInterface,
  ContextInterface,
  ArgsPipelineInterface,
  InputPipelineMilestoneInterface,
} from "@src/interfaces";
import { CreatePipeline, UpdatePipeline, DeletePipeline, createPipelineMilestones } from "@src/validators";
import { PipelineService } from "@src/services";
import { CursorPagination, SuccessResponse } from "@src/helpers";

export const pipelineResolvers = {
  Mutation: {
    createPipeline: async (
      parent: ParentNode,
      args: { input: InputPipelineInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      args.input.ownerId = user.ownerId!;
      Validator.check(CreatePipeline, args.input);
      const createPipeline = await new PipelineService().create(args.input);
      return SuccessResponse.send({
        message: "Pipeline created Successfully",
        data: createPipeline,
      });
    },

    createPipelineMilestones: async (
      parent: ParentNode,
      args: { input: InputPipelineMilestoneInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      args.input.ownerId = user.ownerId!;
      Validator.check(createPipelineMilestones, args.input);
      const createPipeline = await new PipelineService().createPipelineMilestones(args.input);
      return SuccessResponse.send({
        message: "Pipeline created Successfully",
        data: createPipeline,
      });
    },

    updatePipeline: async (
      parent: ParentNode,
      args: { id: number; input: Partial<InputPipelineInterface> },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(UpdatePipeline, args.input);
      const updatedPipeline = await new PipelineService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Pipeline updated Successfully",
        data: updatedPipeline,
      });
    },

    deletePipeline: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(DeletePipeline, args);
      const deletePipeline = await new PipelineService().deleteOne(args.id);
      return SuccessResponse.send({
        message: "Pipeline deleted Successfully",
        data: deletePipeline as Boolean,
      });
    },
  },
  Query: {
    pipeline: async (parent: ParentNode, args: { id: number }, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const pipeline = await new PipelineService().findByPk(args.id);
      return SuccessResponse.send({
        message: "Pipeline fetched Successfully",
        data: pipeline,
      });
    },

    pipelines: async (
      parent: ParentNode,
      args: ArgsPipelineInterface,
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const { cursor, limit, order, sort, cursorOrder, cursorSort, query } = CursorPagination.getCursorQuery({
        before: args.before,
        after: args.after,
        first: args.first,
        last: args.last,
      });

      const { rows, cursorCount, count } = await new PipelineService().findAndCountAll({
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
        message: "Pipeline list is successfully fetched.",
        edges: data,
        pageInfo,
      });
    },
  },
};
