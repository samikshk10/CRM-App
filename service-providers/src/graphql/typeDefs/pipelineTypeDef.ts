import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const pipelineTypeDefs: DocumentNode = gql`
  #graphql

  input InputPipeline {
    name: String!
    parentId: Int
  }

  input InputPipelineMilestone {
    name: String!
    parentId: Int
    milestones: [String]
  }

  input payload {
    name: String
    parentId: Int
  }

  type Pipeline {
    id: Int
    name: String
    slug: String
    parentId: Int
    level: Int
    milestone: [Milestone]
  }

  type CreatedPipeline {
    id: Int
    name: String
    slug: String
    parentId: Int
    level: Int
  }

  type CreatedMilestones {
    id: Int
    pipelineId: Int
    name: String
    slug: String
    ownerId: Int
    rank: Float
  }

  type PipelineWithMilestone {
    id: Int
    name: String
    slug: String
    parentId: Int
    milestone: [CreatedMilestones]
  }

  type PaginationMultiplePipeline {
    message: String
    edges: [PipelineEdge]
    pageInfo: PageInfo
  }

  type PipelineEdge {
    node: Pipeline
    cursor: String
  }

  type Query {
    pipeline(id: Int): SinglePipeline

    pipelines(first: Int, last: Int, after: String, before: String): PaginationMultiplePipeline
  }

  type SinglePipeline {
    message: String
    data: Pipeline
  }

  type SingleNewPipeline {
    message: String
    data: CreatedPipeline
  }

  type SinglePipelineWithMilestone {
    message: String
    data: PipelineWithMilestone
  }

  extend type Mutation {
    createPipeline(input: InputPipeline): SingleNewPipeline
    createPipelineMilestones(input: InputPipelineMilestone): SinglePipelineWithMilestone
    updatePipeline(id: Int, input: payload): SinglePipeline
    deletePipeline(id: Int): Message
  }
`;
