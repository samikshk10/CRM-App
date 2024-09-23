import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const milestoneTypeDefs: DocumentNode = gql`
  #graphql

  input InputMilestone {
    pipelineId: Int!
    name: String!
  }

  input InputPipelineId {
    pipeline: [Int]
  }

  input InputUpdateRankMilestone {
    draggedId: Int
    pipelineId: Int
    higherPivotRank: Float
    lowerPivotRank: Float
  }

  type Milestone {
    id: Int
    pipelineId: Int
    name: String
    slug: String
    ownerId: Int
    deals: [Deal]
    pipeline: Pipeline
    rank: Float
  }

  type SingleMilestone {
    message: String
    data: Milestone
  }
  type MultipleMilestone {
    message: String
    edges: [Milestone]
  }
  extend type Query {
    milestone(id: Int): SingleMilestone
    milestones(input: InputPipelineId!): MultipleMilestone
  }
  extend type Mutation {
    createMilestone(input: InputMilestone!): SingleMilestone
    updateMilestone(id: Int!, input: InputMilestone!): SingleMilestone
    deleteMilestone(id: Int!): Message
    updateRankMilestone(input: InputUpdateRankMilestone): SingleMilestone
  }
`;
