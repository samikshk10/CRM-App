import { GraphQLError, GraphQLResolveInfo } from "graphql";
import {
  ContextInterface,
  InputDealInterface,
  InputDealsByMultipleId,
  InputUpdateDealDecision,
  InputUpdateDealMilestone,
  InputUpdateRankDealsInterface,
  RankInterface,
} from "@src/interfaces";
import { Guard, Validator } from "@src/middlewares";
import {
  createDeal,
  updateDeal,
  deleteDeal,
  updateDealMilestone,
  dealByMultipleId,
  updateDealDecision,
  updateDealRank,
} from "@src/validators";
import { DealService, MilestoneService } from "@src/services";
import { SuccessResponse } from "@src/helpers";
import { assignNewRank, updateExistingRank } from "@src/utils";

export const dealResolvers = {
  Mutation: {
    createDeal: async (
      parent: ParentNode,
      args: { input: InputDealInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      const user = Guard.grant(context.user);
      args.input.ownerId = user.id;
      Validator.check(createDeal, args.input);
      const { pipelineId, milestoneId } = args.input;
      const deals = await new DealService().findAll({ where: { pipelineId, milestoneId } });
      if (deals.length === 0) {
        args.input.rank = 1;
      }
      const dealRank: RankInterface[] = deals.map(({ rank }) => ({
        rank,
      }));
      const newRank = assignNewRank(dealRank);
      args.input.rank = newRank;
      const deal = await new DealService().create(args.input);
      return SuccessResponse.send({
        message: "Deal created successfully",
        data: deal,
      });
    },
    updateDeal: async (
      parent: ParentNode,
      args: { id: number; input: InputDealInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(updateDeal, args.input);
      const deal = await new DealService().updateOne(args.id, args.input);
      return SuccessResponse.send({
        message: "Deal updated successfully",
        data: deal,
      });
    },
    deleteDeal: async (
      parent: ParentNode,
      args: { id: number[] },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(deleteDeal, args);
      const dealDeleted = await new DealService().delete(args.id);
      return SuccessResponse.send({
        message: "Deal(s) deleted successfully",
        data: dealDeleted as Boolean,
      });
    },

    updateDate: async (
      parent: ParentNode,
      args: { id: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const deal = await new DealService().updateCloseDate(args.id);
      return SuccessResponse.send({
        message: "Deal updated successfully",
        data: deal,
      });
    },

    updateDealMilestone: async (
      parent: ParentNode,
      args: { id: number[]; input: InputUpdateDealMilestone },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(updateDealMilestone, args.input);
      const { milestoneId, pipelineId } = args.input;
      await new DealService().verifyDealWithinPipeline(args.id, pipelineId);
      await new MilestoneService().verifyMilestoneWithinPipeline(milestoneId, pipelineId);
      const deal = await new DealService().bulkUpdate(args.id, { milestoneId });
      return SuccessResponse.send({
        message: "Deal updated successfully",
        edges: deal,
      });
    },

    updateDealDecision: async (
      parent: ParentNode,
      args: { id: number; input: InputUpdateDealDecision },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(updateDealDecision, args.input);
      const deal = await new DealService().updateDecision(args.id, args.input);
      return SuccessResponse.send({
        message: "Deal decision updated",
        data: deal,
      });
    },

    updateRankDeal: async (
      parent: ParentNode,
      args: { input: InputUpdateRankDealsInterface },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(updateDealRank, args.input);

      const { draggedId, pipelineId, higherPivotRank, lowerPivotRank, milestoneId } = args.input;

      const deals = await new DealService().findAll({ where: { pipelineId, milestoneId } });
      if (deals.length === 0) {
        throw new GraphQLError("Fetch Deal failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 400,
            message: `Deal with pipelineId: ${pipelineId} or milestoneId: ${milestoneId} does not exists`,
            attribute: ["Pipeline Id", "Milestone Id"],
          },
        });
      }
      const updatedDealRank = updateExistingRank(
        deals.map(({ rank }) => ({ rank })),
        higherPivotRank,
        lowerPivotRank,
      );
      const updatedDeals = await new DealService().updateOne(draggedId, { rank: updatedDealRank });
      return SuccessResponse.send({
        message: "Deals rank updated successfully",
        data: updatedDeals,
      });
    },
  },

  Query: {
    deal: async (parent: ParentNode, args: { id: number }, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const deal = await new DealService().findByPk(args.id);
      return SuccessResponse.send({
        message: "Deal fetched Successfully",
        data: deal,
      });
    },

    deals: async (
      parent: ParentNode,
      args: { pipelineId: number; milestoneId: number },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const deals = await new DealService().findByPipelineMilestoneId(args.pipelineId, args.milestoneId);
      return SuccessResponse.send({
        message: "Deals fetched Successfully",
        edges: deals,
      });
    },

    allDeals: async (parent: ParentNode, args: {}, context: ContextInterface, info: GraphQLResolveInfo) => {
      Guard.grant(context.user);
      const deals = await new DealService().findAll({});
      return SuccessResponse.send({
        message: "Deals fetched Successfully",
        edges: deals,
      });
    },

    dealsByMultipleId: async (
      parent: ParentNode,
      args: { input: InputDealsByMultipleId },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      Validator.check(dealByMultipleId, args.input);
      const deals = await new DealService().findByMultipleId(args.input);
      return SuccessResponse.send({
        message: "Deals fetched succesfully",
        edges: deals,
      });
    },

    dealBySearch: async (
      parent: ParentNode,
      args: { search: string },
      context: ContextInterface,
      info: GraphQLResolveInfo,
    ) => {
      Guard.grant(context.user);
      const deals = await new DealService().findBySearch(args.search);
      return SuccessResponse.send({
        message: "Deals Search Succesfully",
        edges: deals,
      });
    },
  },
};
