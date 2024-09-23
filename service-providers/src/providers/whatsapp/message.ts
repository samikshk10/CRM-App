import {
    FacebookGetMessageInterface,
    FacebookSendMessageInterface,
    FacebookSendMessageResponseInterface,
    InputFacebookWebhookMessageInterface,
    InputWhatsappWebhookMessageInterface,
    MessagesResponseInterface,
    OutputFacebookWebhookMessageInterface,
    OutputWhatsappWebhookMessageInterface,
    WhatsappMessageInterface,
    WhatsappSendMessageInterface,
    WhatsappSendMessageResponseInterface,
} from "@src/interfaces";
import { GraphQLError } from "graphql";
import axios from "axios";
import { facebook } from "@src/config";

class WhatsappMessage {
    private phoneId: string | undefined;
    private accessToken: string | undefined;

    constructor({ phoneId, accessToken }: WhatsappMessageInterface) {
        this.phoneId = phoneId;
        this.accessToken = accessToken;
    }

    async sendMessage(input: WhatsappSendMessageInterface) {
        const url = `${facebook.baseUrl}/v17.0/${this.phoneId}/messages`;
        const headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
        };

        const data = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: input.recipient.id.toString(),
            type: "text",
            text: {
                body: input.message.text,
            },
        };


        const messageSendResponse = await axios.post(url, data, { headers });
        if (messageSendResponse.data.error) {
            throw new GraphQLError(messageSendResponse.data.error.message, {
                extensions: {
                    code: "BAD_USER_INPUT",
                    status: 400,
                    message: messageSendResponse.data.error.message,
                    attribute: "message",
                },
            });
        }
        return messageSendResponse.data;
    }

    async MessageWebhook(input: InputWhatsappWebhookMessageInterface): Promise<OutputWhatsappWebhookMessageInterface> {
        return {
            phoneId: input.phoneId,
            message: input.message,
            // result: input.result,
        };
    }
}

export { WhatsappMessage };
