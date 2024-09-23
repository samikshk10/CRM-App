import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const testTypeDefs: DocumentNode = gql`
  #graphql

  type HelloPayload {
    hello: String
  }

  type Subscription {
    hello: HelloPayload
  }
`;
