import axios from "axios";
import { AccessTokenInterface } from "@src/interfaces";
import { facebook } from "@src/config";
class AccessToken {
  private appId: string;
  private appSecret: string;
  private accessToken: string | undefined;

  constructor({ appId, appSecret, accessToken }: AccessTokenInterface) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.accessToken = accessToken;
  }

  async longLivedToken(): Promise<string> {
    const accessToken = await axios.get(
      `${facebook.baseUrl}/v13.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${this.accessToken}`,
    );
    const longLivedAccessToken = accessToken.data.access_token;
    return longLivedAccessToken;
  }

  async appAccessToken(): Promise<string> {
    const accessToken = await axios.get(
      `${facebook.baseUrl}/v13.0/oauth/access_token?grant_type=client_credentials&client_id=${this.appId}&client_secret=${this.appSecret}`,
    );
    const appAccessToken = accessToken.data.access_token;
    return appAccessToken;
  }
}

export { AccessToken };
