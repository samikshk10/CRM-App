import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const TaskTagDefs: DocumentNode = gql`
  #graphql
  input InputAssignTagToTask {
    taskId: Int!
    tagIds: [Int]!
  }

  type TaskTag {
    id: Int
    taskId: Int
    tagId: Int
  }

  type SingleTaskTag {
    message: String
    edges: [TaskTag]
  }

  extend type Mutation {
    assignTagToTask(input: InputAssignTagToTask): SingleTaskTag
  }
`;
