import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const authDefs: DocumentNode = gql`
  #graphql
  input InputAuthSignUp {
    name: String!
    email: String!
    phoneNumber: String
    password: String!
  }

  input InputAuthResendConfirmationCode {
    email: String!
  }

  input InputAuthConfirmationSignUp {
    email: String!
    confirmationCode: String!
  }

  input InputAuthLogin {
    email: String!
    password: String!
  }

  input InputChangePassword {
    previousPassword: String!
    proposedPassword: String!
  }

  input InputForgotPassword {
    email: String!
  }

  input InputConfirmForgotPassword {
    verificationCode: String!
    newPassword: String!
    email: String!
  }

  input InputRefreshToken {
    refreshToken: String
  }

  type Email {
    email: String
  }

  type Message {
    message: String
  }

  type SingUpResponse {
    message: String
    data: Email
  }

  type LoginToken {
    access: String
    refresh: String
  }

  type UserToken {
    token: LoginToken
  }

  type Login {
    message: String
    data: UserToken
  }

  type authMeResponse {
    message: String
    data: SingleUser
  }

  type ForgotPassword {
    message: String
    data: Email
  }


  type RefreshTokenData {
    data: LoginToken
    message: String
  }

  extend type Mutation {
    signUp(input: InputAuthSignUp!): SingUpResponse
    resendConfirmationCode(input: InputAuthResendConfirmationCode!): Message
    confirmSignUp(input: InputAuthConfirmationSignUp!): Message
    login(input: InputAuthLogin!): Login
    authMe(input: InputUser!): SingleUser
    changePassword(input: InputChangePassword!): Message
    forgotPassword(input: InputForgotPassword!): Message
    confirmForgotPassword(input: InputConfirmForgotPassword!): Message
    refreshToken(input: InputRefreshToken): RefreshTokenData
  }

  extend type Query {
    authMe: SingleUser
  }
`;
