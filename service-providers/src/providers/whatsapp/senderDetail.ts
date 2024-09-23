import { facebook } from "@src/config";
import { WhatsappGetSenderDetailsInterface, WhatsappSenderResultInterface } from "@src/interfaces"
import axios from "axios";
import { GraphQLError } from "graphql";
class SenderDetails {
    private static instance: SenderDetails;
    private constructor() { }

    static get(): SenderDetails {
        if (!SenderDetails.instance) {
            SenderDetails.instance = new SenderDetails();
        }
        return SenderDetails.instance;
    }


    async getSenderDetails(input: WhatsappGetSenderDetailsInterface): Promise<WhatsappSenderResultInterface> {
        const messageSendResponse = await axios.get(`${facebook.baseUrl}/v18.0/${input.whatsappBusinessID}/phone_numbers?access_token=${input.accessToken}`)
        if (messageSendResponse.data.error) {
            throw new GraphQLError(messageSendResponse.data.error.message, {
                extensions: {
                    code: messageSendResponse.data.error.type,
                    status: messageSendResponse.data.error.code,
                    message: messageSendResponse.data.error.message,
                    attribute: "message",
                },
            });
        }
        return messageSendResponse.data;
    }
}

const senderDetails = SenderDetails.get();
export default senderDetails

