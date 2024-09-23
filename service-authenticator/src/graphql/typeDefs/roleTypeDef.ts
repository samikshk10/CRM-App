import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const roleDefs: DocumentNode = gql`
  #graphql
  type Role {
    id: Int
    label: String
    level: Int
    slug: String
    position: Int
    # use package for slug
  }
  input InputRole {
    label: String
    level: Int
    position:Int
  }
 
  type SingleRole {
    message: String
    data: Role
  }
  type Query {
    role: Role
  }

  type Mutation {
    createRole(input: InputRole!): SingleRole
    updateRole(id: Int!, input: InputRole): SingleRole
  }
`;
