import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const providerMessageTypeDef: DocumentNode = gql`
  input InputChatMessageFacebook {
    platform: String
    contactId: Int
    message: String
  }

  type ChatMessageFacebook {
    recipientId: String
    messageId: String
  }

  type SingleChatMessageFacebook {
    message: String
    data: ChatMessageFacebook
  }

  input InputSearchMessageFacebook {
    searchKeyword: String
    contactId: Int
    after: String
    before: String
  }

  type UserData {
    name: String
    id: String
    email: String
  }

  type ToUserData {
    data: [UserData]
  }

  type Cursors {
    before: String
    after: String
  }

  type PaginationInfo {
    count: Int
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    startCursor: String
    endCursor: String
  }

  type Messages {
    id: String
    message: String
    to: ToUserData
    from: UserData
  }

  type MessageResponse {
    message: String
    edges: [Messages]
    pageInfo: PaginationInfo
  }
  extend type Query {
    fetchMessage(input: InputSearchMessageFacebook): MessageResponse
  }

  extend type Mutation {
    sendMessage(input: InputChatMessageFacebook): SingleChatMessageFacebook
  }
`;
