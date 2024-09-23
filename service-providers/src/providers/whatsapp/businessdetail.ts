import { facebook } from "@src/config";
import { FacebookPagesInterface, WhatsappBusinessInterface } from "@src/interfaces";
import axios from "axios";
import { GraphQLError } from "graphql";

class BusinessDetails {
    private static instance: BusinessDetails;
    private constructor() {

    }

    static get(): BusinessDetails {
        if (!BusinessDetails.instance) {
            BusinessDetails.instance = new BusinessDetails();
        }
        return BusinessDetails.instance
    }

    async getBusinessDetails(input: WhatsappBusinessInterface): Promise<any> {
        const businessDetails = await axios.get(`${facebook.baseUrl}/v18.0/${input.businessID}/phone_numbers?access_token=${input.accessToken}`)
        if (businessDetails.data.error) {
            throw new GraphQLError(businessDetails.data.error.message, {
                extensions: {
                    code: "BAD_USER_INPUT",
                    status: businessDetails.data.error.code,
                    message: businessDetails.data.error.message,
                    attribute: "message",
                },
            });
        }
        return businessDetails.data;
    }
}

const BusinessDetail = BusinessDetails.get();
export {
    BusinessDetail as BusinessDetail
}