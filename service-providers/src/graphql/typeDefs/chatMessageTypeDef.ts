import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const chatMessageTypeDef: DocumentNode = gql`
  #graphql
  enum ChatMessageType {
    INTERNAL
    EXTERNAL
  }
  enum DirectionStatus {
    INCOMING
    OUTGOING
  }
  input InputChatMessage {
    chatSessionId: Int
    senderId: Int
    content: String
    messageType: ChatMessageType
    direction: DirectionStatus
  }
  type ChatMessageEdge {
    node: ChatMessage
    cursor: String
  }
  type ChatMessage {
    id: Int
    chatSessionId: Int
    senderId: Int
    content: String
    messageType: ChatMessageType
    ownerId: Int
    direction: DirectionStatus
    timestamp: Date
  }
  type PaginationChatMessages {
    message: String
    edges: [ChatMessageEdge]
    pageInfo: PageInfo
  }
  type SingleChatMessage {
    message: String
    data: ChatMessage
  }
  type ChatMessages {
    message: String
    data: [ChatMessage]
  }

  extend type Query {
    chatMessages(
      first: Int
      last: Int
      before: String
      after: String
      chatSessionId: Int
      senderId: String
    ): PaginationChatMessages
  }
  extend type Mutation {
    createChatMessage(input: InputChatMessage!): SingleChatMessage
    updateChatMessage(id: Int!, input: InputChatMessage!): SingleChatMessage
    deleteChatMessage(id: Int!): Message
  }
`;
