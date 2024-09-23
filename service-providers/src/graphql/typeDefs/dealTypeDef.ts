import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const dealTypeDefs: DocumentNode = gql`
  #graphql
  scalar Date

  type Deal {
    id: Int
    name: String
    company: String
    value: Int
    pipelineId: Int
    milestoneId: Int
    description: String
    owner: Owner
    assigneeId: Int
    reporterId: Int
    closingDate: Date
    createdAt: Date
    contact: Contact
    milestone: Milestone
    decision: Decision
    rank: Float
  }

  type Decision {
    won: Boolean
    price: Int
    description: String
  }

  type Owner {
    id: Int
    name: String
  }

  input InputDeal {
    name: String
    contactId: Int
    company: String
    value: Int
    pipelineId: Int
    milestoneId: Int
    description: String
    assigneeId: Int
    reporterId: Int
    closingDate: Date
  }

  input InputUpdateDealMilestone {
    milestoneId: Int
    pipelineId: Int
  }

  input InputUpdateDealDecision {
    won: Boolean
    price: Int
    description: String
  }

  input InputMultipleId {
    pipeline: [Int]
    milestone: [Int]
  }

  input InputUpdateRankDeal {
    draggedId: Int
    pipelineId: Int
    milestoneId: Int
    higherPivotRank: Float
    lowerPivotRank: Float
  }

  type SingleDeal {
    message: String
    data: Deal
  }

  type MultipleDeal {
    message: String
    edges: [Deal]
  }

  type Message {
    message: String
  }

  extend type Query {
    deal(id: Int): SingleDeal
    deals(pipelineId: Int, milestoneId: Int): MultipleDeal
    dealsByMultipleId(input: InputMultipleId!): MultipleDeal
    allDeals: MultipleDeal
    dealBySearch(search: String): MultipleDeal
  }

  extend type Mutation {
    createDeal(input: InputDeal): SingleDeal
    updateDeal(id: Int, input: InputDeal): SingleDeal
    deleteDeal(id: [Int]): Message
    updateDate(id: Int): SingleDeal
    updateDealMilestone(id: [Int], input: InputUpdateDealMilestone): MultipleDeal
    updateDealDecision(id: Int!, input: InputUpdateDealDecision): SingleDeal
    updateRankDeal(input: InputUpdateRankDeal): SingleDeal
  }
`;
