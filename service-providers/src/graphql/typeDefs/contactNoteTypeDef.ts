import { date } from "joi";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const contactNoteDefs: DocumentNode = gql`
  #graphql
  input InputContactNote {
    description: String
    contactId: Int
  }

  type ContactNote {
    id: Int
    description: String
    createdAt: DateTime
    updatedAt:DateTime
  }

  type SingleContactNote {
    message: String
    data: ContactNote
  }

  type ContactNotes {
    message: String
    data: [ContactNote]
  }
  extend type Query {
    contactNote(id: Int): SingleContactNote
    contactNotes(contactId: Int): ContactNotes
  }

  extend type Mutation {
    createContactNote(input: InputContactNote!): SingleContactNote
    updateContactNote(id: Int!, input: InputContactNote!): SingleContactNote
    deleteContactNote(id: Int!): Message
  }
`;
