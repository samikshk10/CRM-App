import axios from "axios";
import { WebhookSubscriptionInterface } from "@src/interfaces";
import { facebook } from "@src/config";

class WebhookSubscription {
  private pageId: string | undefined;
  private pageAccessToken: string | undefined;
  private appId: string | undefined;
  private accessToken: string | undefined;
  private verifyToken: string | undefined;

  constructor({ appId, accessToken, verifyToken, pageId, pageAccessToken }: WebhookSubscriptionInterface) {
    this.appId = appId;
    this.accessToken = accessToken;
    this.verifyToken = verifyToken;
    this.pageId = pageId;
    this.pageAccessToken = pageAccessToken;
  }

  async webhookPageSubscription(): Promise<{ success: boolean }> {
    const webhookSubscription = await axios.post(`${facebook.baseUrl}/${this.pageId}/subscribed_apps`, {
      access_token: this.pageAccessToken,
      subscribed_fields: "messages", // Add the necessary fields
    });
    return webhookSubscription.data;
  }

  async webhookSubscription(callback_url: string): Promise<any> {
    const webhookSubscription = await axios.post(`${facebook.baseUrl}/${this.appId}/subscriptions`, {
      object: "page",
      callback_url: callback_url,
      fields: "messages",
      verify_token: this.verifyToken,
      access_token: this.accessToken,
    });
    return webhookSubscription.data;
  }
}

export { WebhookSubscription };
