import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const chatSessionDefs: DocumentNode = gql`
  #graphql
  enum ChatSessionStatus {
    OPEN
    CLOSED
  }
  input InputChatSession {
    contactId: Int
    status: ChatSessionStatus
    reporterId: Int
    messagePlatformId: Int
    assigneeId: Int
  }
  type ChatSessionEdge {
    node: ChatSession
    cursor: String
  }
  type ChatSession {
    id: Int
    ownerId: Int
    contactId: Int
    messagePlatformId: Int
    status: ChatSessionStatus
    assigneeId: Int
    reporterId: Int
    assignee: User
  }
  type PaginationChatSessions {
    message: String
    edges: [ChatSessionEdge]
    pageInfo: PageInfo
  }
  type SingleChatSession {
    message: String
    data: ChatSession
  }
  type ChatSessions {
    message: String
    data: [ChatSession]
  }

  extend type Query {
    chatSession(id: Int!): SingleChatSession
    chatSessions(
      first: Int
      last: Int
      before: String
      after: String
      status: ChatSessionStatus
    ): PaginationChatSessions
  }
  extend type Mutation {
    createChatSession(input: InputChatSession!): SingleChatSession
    updateChatSession(id: Int!, input: InputChatSession!): SingleChatSession
    deleteChatSession(id: Int!): Message
  }
`;
