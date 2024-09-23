import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const taskTypeDefs: DocumentNode = gql`
  #graphql

  input InputTaskType {
    label: String
  }
  type PaginationMultipleTaskType {
    message: String
    edges: [TaskTypeEdge]
    pageInfo: PageInfo
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    count: Int
  }

  type TaskTypeEdge {
    node: TaskType
    cursor: String
  }

  type TaskType {
    id: Int
    label: String
    slug: String
    ownerId: Int
  }

  type SingleTaskType {
    message: String
    data: TaskType
  }

  extend type Query {
    taskTypes(first: Int, last: Int, after: String, before: String): PaginationMultipleTaskType
    taskType(id: Int): SingleTaskType
  }

  extend type Mutation {
    createTaskType(input: InputTaskType!): SingleTaskType
    updateTaskType(id: Int, input: InputTaskType): SingleTaskType
    deleteTaskType(id: Int): Message
  }
`;
