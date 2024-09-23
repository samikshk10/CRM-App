import { DocumentNode } from "graphql"
import gql from "graphql-tag"

export const platformTypeDefs: DocumentNode = gql`
    #graphql
    input InputPlatform {
        name:String!
        active:Boolean
        avatarUrl:String
    }

    type Platform {
        id:Int
        name:String
        active:Boolean
        avatarUrl:String
    }

    type SinglePlatform{
        message:String
        data:Platform
    }
    type MultiplePlatform{
        message:String
        edges:[Platform]
    }

    extend type Query {
        platform(id:Int):SinglePlatform
        platforms:MultiplePlatform
    }

    type Mutation {
        createPlatform(input:InputPlatform):SinglePlatform
        updatePlatform(id:Int,input:InputPlatform):SinglePlatform
        deletePlatform(id:Int):Message
    }
`;