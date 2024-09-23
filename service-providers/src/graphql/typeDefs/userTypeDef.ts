import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const userDefs: DocumentNode = gql`
  #graphql
  input InputUser {
    name: String
  }

  type User {
    id: Int
    name: String
    email: String
    phoneNumber: String
  }

  type SingleUser {
    message: String
    data: User
  }
`;
