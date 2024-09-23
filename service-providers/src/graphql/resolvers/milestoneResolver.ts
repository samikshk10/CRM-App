import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { Guard, Validator } from "@src/middlewares";
import { createMilestone, updateMilestone, deleteMilestone, updateMilestoneRank } from "@src/validators";
import { MilestoneService } from "@src/services";
import { SuccessResponse } from "@src/helpers";
import { assignNewRank, updateExistingRank } from "@src/utils";
import {
  RankInterface,
  ContextInterface,
  InputMilestoneByMultipleId,
  InputMilestoneInterface,
  InputUpdateRankMilestoneInterface,
} from "@src/interfaces";

export const milestoneResolvers = {
  Mutation: {
    createMilestone: async (
      parent: ParentNode,
      args: { input: InputMilestoneInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      args.input.ownerId = user.ownerId!;

      Validator.check(createMilestone, args.input);
      const milestones = await new MilestoneService().findAll({
        pipelineId: args.input.pipelineId,
      });
      if (milestones.length === 0) {
        throw new GraphQLError("Fetch milestone failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Milestone with ParentId: ${args.input.pipelineId} does not exists`,
            attribute: "Pipeline ID",
          },
        });
      }
      const milestoneRank: RankInterface[] = milestones.map(({ rank }) => ({
        rank,
      }));

      const newRank = assignNewRank(milestoneRank);
      args.input.rank = newRank;
      const milestone = await new MilestoneService().create(args.input);
      return SuccessResponse.send({
        message: "Milestone created successfully",
        data: milestone,
      });
    },

    updateMilestone: async (
      parent: ParentNode,
      args: { id: number; input: InputMilestoneInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(updateMilestone, args.input);
      const updatedMilestone = await new MilestoneService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Milestone updated successfully",
        data: updatedMilestone,
      });
    },

    deleteMilestone: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(deleteMilestone, args);
      const milestone = await new MilestoneService().deleteOne(args.id);
      return SuccessResponse.send({
        message: "Milestone deleted successfully",
      });
    },

    updateRankMilestone: async (
      parent: ParentNode,
      args: { input: InputUpdateRankMilestoneInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(updateMilestoneRank, args.input);

      const { draggedId, pipelineId, higherPivotRank, lowerPivotRank } =
        args.input;

      const milestones = await new MilestoneService().findAll({
        pipelineId: pipelineId,
      });
      if (milestones.length === 0) {
        throw new GraphQLError("Fetch milestone failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Milestone with ParentId: ${pipelineId} does not exists`,
            attribute: "Pipeline ID",
          },
        });
      }

      const updatedMilestoneRank = updateExistingRank(
        milestones.map(({ rank }) => ({ rank })),
        higherPivotRank,
        lowerPivotRank
      );

      const updatedMilestone = await new MilestoneService().updateOne(
        draggedId,
        { rank: updatedMilestoneRank }
      );

      return SuccessResponse.send({
        message: "Milestone rank updated successfully",
        data: updatedMilestone,
      });
    },
  },

  Query: {
    milestone: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const milestone = await new MilestoneService().findByPk(args.id);
      return SuccessResponse.send({
        message: "Milestone fetched Successfully",
        data: milestone,
      });
    },

    milestones: async (
      parent: ParentNode,
      args: { input: InputMilestoneByMultipleId },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const milestones = await new MilestoneService().findByPipelineId(args.input);
      return SuccessResponse.send({
        message: "Milestones fetched Successfully",
        edges: milestones,
      });
    },
  },
};
