import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const tagDefs: DocumentNode = gql`
  #graphql
  input InputTag {
    name: String!
    color: String!
  }

  type Tag {
    id: Int
    name: String
    slug: String
    color: String
  }

  type PaginationMultipleTag {
    message: String
    edges: [TagEdge]
    pageInfo: PageInfo
  }

  type TagEdge {
    node: Tag
    cursor: String
  }
  
  type SingleTag {
    message: String
    data: Tag
  }


  type Tags {
    message: String
    edges: [Tag]
  }

  extend type Query {
    tags(
      first: Int
      last: Int
      after: String
      before: String
    ): PaginationMultipleTag
    tag(id: Int): SingleTag
  }

  extend type Mutation {
    createTag(input: InputTag!): SingleTag
    updateTag(id: Int!, input: InputTag!): SingleTag
    deleteTag(id: Int!): Message
  }
`;
