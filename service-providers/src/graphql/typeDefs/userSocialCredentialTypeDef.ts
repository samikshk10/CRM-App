import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const userSocialCredentialTypeDef: DocumentNode = gql`
  #graphql
  input credentialObject {
    appid: String
    appsecret: String
    callbackURL: String
    accessToken: String
    userId: String
    displayName: String
    verifyToken: String
    webhookStatus: String
    webhookURL: String
    pageId: String
    pageName: String
    pageAccessToken: String
    businessID:String
  }

  input InputUserSocialCredential {
    platformId: Int!
    appid: String!
    appsecret: String!
    callbackURL: String!
    webhookURL: String!
    accessToken: String!
    userId: String!
    displayName: String!
    verifyToken: String!
  }

  input UpdateUserSocialCredential {
    platformId: Int
    credentials: credentialObject
  }

  type credentials {
    appId: String
    appSecret: String
    callbackURL: String
    accessToken: String
    userId: String
    displayName: String
    verifyToken: String
    webhookStatus: String
    webhookURL: String
    pageId: String
    pageName: String
    pageAccessToken: String
  }

  type UserSocialCredential {
    id: Int
    platformId: Int
    credentials: credentials
  }

  type SingleUserSocialCredential {
    message: String
    data: UserSocialCredential
  }

  type MultipleUserSocialCredential {
    message: String
    edges: [UserSocialCredential]
  }

  extend type Query {
    userSocialCredentials: MultipleUserSocialCredential
  }

  extend type Mutation {
    createUserSocialCredential(input: InputUserSocialCredential): SingleUserSocialCredential
    updateUserSocialCredential(id: Int, input: UpdateUserSocialCredential): SingleUserSocialCredential
    subscribeWebhook(id: Int): SingleUserSocialCredential
  }
`;
