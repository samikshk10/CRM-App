import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const contactDefs: DocumentNode = gql`
  #graphql
  enum ContactStatus {
    WON
    LOST
    IN_NEGOTIATION
    IN_CONVERSATION
  }

  enum ContactSource {
    MANUALLY
    INSTAGRAM
    FACEBOOK
    WHATSAPP
    FROM_CONTACTS
  }
  input InputContact {
    name: String
    email: String
    address: String
    contactNumber: String
    companyDomain: String
    company: String
    profilePictureId: Int
  }

  input InputContactFilter {
    tagId: [Int]
    status: [ContactStatus]
  }
  input InputUpdateContactStatus{
    status: ContactStatus
  }

  type Contact {
    id: Int
    name: String
    email: String
    address: String
    contactNumber: String
    companyDomain: String
    company: String
    tags: [Tag]
    tasks: [Task]
    status: ContactStatus
    notes: [ContactNote]
    profile: Media
    files: [Attachment]
    source: ContactSource
  }
  type Media {
    id: Int
    url: String
    mimetype: String
  }
  type SingleContact {
    message: String
    data: Contact
  }

  type contacts {
    message: String
    data: [Contact]
  }

  type PaginationMultipleContact {
    message: String
    edges: [ContactEdge]
    pageInfo: PageInfo
  }

  type ContactEdge {
    node: Contact
    cursor: String
  }

  extend type Query {
    contact(id: Int): SingleContact
    contacts(
      first: Int
      last: Int
      after: String
      before: String
      source: ContactSource
      status: ContactStatus
    ): PaginationMultipleContact
    contactsBySearch(search: String): contacts
    contactsByFilter(input: InputContactFilter): contacts
  }

  extend type Mutation {
    createContact(input: InputContact): SingleContact
    updateContact(id: Int!, input: InputContact): SingleContact
    updateContactStatus(id: Int!, input:InputUpdateContactStatus): SingleContact
    deleteContact(id: Int!): Message
  }
`;
