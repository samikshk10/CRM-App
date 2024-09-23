import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const taskDefs: DocumentNode = gql`
  #graphql
  scalar DateTime

  input InputTask {
    title: String
    description: String
    assigneeId: Int
    parentId: Int
    dueDate: DateTime
    reminderDate: DateTime
    reporterId: Int
    contactId: Int
    pipelineId: Int
    typeId: Int
    level: Int
    tagId: Int
    completedDate: DateTime
    subTasks: [String]
  }

  type Task {
    id: Int
    title: String
    description: String
    assigneeId: Int
    level: Int
    parentId: Int
    dueDate: DateTime
    reminderDate: DateTime
    reporterId: Int
    typeId: Int
    taskType: TaskType
    tagId: Int
    contactId: Int
    tags: [Tag]
    completedDate: DateTime
    starred: Boolean
    pipeline: Pipeline
    subTasks: [SubTask]
    files: [Attachment]
  }

  type PaginationMultipleTask {
    message: String
    edges: [TaskEdge]
    pageInfo: PageInfo
  }

  type TaskEdge {
    node: Task
    cursor: String
  }

  type SingleTask {
    message: String
    data: Task
  }

  extend type Query {
    tasks(first: Int, last: Int, after: String, before: String): PaginationMultipleTask
    task(id: Int): SingleTask
  }

  extend type Mutation {
    createTask(input: InputTask): SingleTask
    updateTask(id: Int, input: InputTask): SingleTask
    deleteTask(id: Int): Message
    toggleTaskStar(id: Int): SingleTask
  }
`;
