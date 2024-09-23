import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export const contactActivityTimelineDefs: DocumentNode = gql`
  #graphql
  enum ContactActivityTypeEnum {
    CONTACT_ADDED
    CONTACT_ASSIGNED
    TASK_CREATED
    NOTE_ADDED
    MAIL_SENT
  }

  type ContactActivityTimeline {
    id: Int
    contactId: Int
    activityById: Int
    referenceId: Int
    referenceRelation: String
    type: ContactActivityTypeEnum
    contact: Contact
    activityBy: User
    note: ContactNote
    task: Task
    chatSession: ChatSession
  }

  type ContactActivityTimelineEdge {
    node: ContactActivityTimeline
    cursor: String
  }

  type PaginationContactActivityTimelines {
    message: String
    edges: [ContactActivityTimelineEdge]
    pageInfo: PageInfo
  }

  extend type Query {
    contactActivityTimelines(
      first: Int
      last: Int
      before: String
      after: String
      type: ContactActivityTypeEnum
      contactId: Int!
    ): PaginationContactActivityTimelines
  }

`;
