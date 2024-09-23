import { DocumentNode } from "graphql"
import gql from "graphql-tag"

export const contactSocialIdentitiesTypeDef: DocumentNode = gql`
#graphql
    input detailsObject {
        name: String
        gender: String
        profilePicUrl: String
        conversationId: String
    }
    input InputContactSocialIdentities {
       userSocialCredentialId: Int
       contactAccessId: Int
        meta: detailsObject
    }

    input UpdateContactSocialIdentities {
        userSocialCredentialId: Int
        meta: detailsObject
    }
    type SenderDetails {
        name: String
        gender: String
        profilePicUrl: String
        conversationId: String
    }
    type ContactSocialIdentity {
        id: Int
        userSocialCredentialId: Int
        contactAccessId: String
        ownerId: Int
        meta: SenderDetails
    }

    type SingleContactSocialIdentities {
        message: String
        data: ContactSocialIdentity
    }

    type ContactSocialIdentities {
        message: String
        edges: [ContactSocialIdentity]
    }
    extend type Mutation {
        updateContactSocialIdentities(id: Int, input: UpdateContactSocialIdentities ): SingleContactSocialIdentities
        deleteContactSocialIdentities(id: Int): Message
    }

`;