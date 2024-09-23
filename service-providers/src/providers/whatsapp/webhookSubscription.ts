import { facebook } from "@src/config";
import { WebhookSubscriptionInterface } from "@src/interfaces";
import axios from "axios";

class WebhookSubscription {
    private appId: string | undefined;
    private accessToken: string | undefined;
    private verifyToken: string | undefined;

    constructor({ appId, accessToken, verifyToken }: WebhookSubscriptionInterface) {
        this.appId = appId;
        this.accessToken = accessToken;
        this.verifyToken = verifyToken;
    }

    async webhookSubscription(callback_url: string): Promise<any> {
        const webhookSubscription = await axios.post(`${facebook.baseUrl}/${this.appId}/subscriptions`, {
            object: "whatsapp_business_account",
            callback_url: callback_url,
            fields: "messages",
            verify_token: this.verifyToken,
            access_token: this.accessToken,
        });
        return webhookSubscription.data;
    }
}

export { WebhookSubscription };
