import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const SubTaskTypeDefs: DocumentNode = gql`
  #graphql

  input InputSubTask {
    taskId: Int
    description: String!
    completed: Boolean
  }

  type SubTask {
    id: Int
    description: String
    completed: Boolean
  }
  

  type SingleSubTask {
    message: String
    data: SubTask
  }

  type SubTasks {
    message: String
    data: [SubTask]
  }

  extend type Query {
    subTask(id: Int): SingleSubTask
    subTasks: SubTasks
  }
  extend type Mutation {
    createSubTask(input: InputSubTask!): SingleSubTask
    updateSubTask(id: Int!, input: InputSubTask!): SingleSubTask
    deleteSubTask(id: Int!): Message
  }
`;
