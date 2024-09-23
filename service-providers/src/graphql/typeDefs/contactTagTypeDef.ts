import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const contactTagDefs: DocumentNode = gql`
  #graphql

  input InputAssignTagToContactTag {
    contactId: Int!
    tagId: Int!
  }

  type ContactTag {
    id: Int
    contactId: Int
    tagId: Int
  }

  type SingleContactTag {
    message: String
    data: ContactTag
  }

  extend type Mutation {
    assignTagToContact(input: InputAssignTagToContactTag): SingleContactTag
    unassignTagToContact(input: InputAssignTagToContactTag): Message
  }
`;
