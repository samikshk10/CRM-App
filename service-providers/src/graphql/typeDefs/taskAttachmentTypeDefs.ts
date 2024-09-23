import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const taskAttachmentDefs: DocumentNode = gql`
  #graphql
  input InputUploadTaskAttachment {
    taskId: Int
    attachmentId: Int
  }
  extend type Mutation {
    uploadTaskAttachment(input: InputUploadTaskAttachment): Message
  }
  extend type Query {
    taskAttachments(taskId: Int!): MultipleMedia
  }
`;