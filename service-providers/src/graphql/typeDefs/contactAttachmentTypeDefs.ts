import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const contactAttachmentDefs: DocumentNode = gql`
  #graphql
  input InputUploadContactAttachment {
    contactId: Int
    attachmentId: Int
  }
  type Attachment {
    attachment: Media
  }
  type MultipleMedia {
    message: String
    edges: [Attachment]
  }
  extend type Mutation {
    uploadContactAttachment(input: InputUploadContactAttachment): Message
  }
  extend type Query {
    contactAttachments(contactId: Int!): MultipleMedia
  }
`;