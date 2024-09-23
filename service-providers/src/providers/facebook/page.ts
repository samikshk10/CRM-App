import axios from "axios";
import { PageDetailInterface } from "@src/interfaces";
import { facebook } from "@src/config";

class PageDetail {
  private userId: string | undefined;
  private accessToken: string | undefined;
  constructor({ userId, accessToken }: PageDetailInterface) {
    this.userId = userId;
    this.accessToken = accessToken;
  }

  async getPageDetail(): Promise<any> {
    const pageDetail = await axios.get(
      `${facebook.baseUrl}/v13.0/${this.userId}/accounts?access_token=${this.accessToken}`,
    );
    return pageDetail.data;
  }
}

export { PageDetail };
