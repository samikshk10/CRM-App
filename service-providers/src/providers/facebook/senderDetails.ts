import { SenderDetailsInterface, FacebookSenderResultInterface } from "@src/interfaces";
import axios from "axios";
import { GraphQLError } from "graphql";
import { facebook } from "@src/config";
class SenderDetails {
  private psId: string;
  private accessToken: string;
  constructor({ psId, accessToken }: SenderDetailsInterface) {
    this.psId = psId;
    this.accessToken = accessToken;
  }

  async getSenderDetails(): Promise<FacebookSenderResultInterface> {
    const messageSendResponse = await axios.get(
      `${facebook.baseUrl}/v13.0/${this.psId}?fields=first_name,last_name,profile_pic&access_token=${this.accessToken}`,
    );
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
}
export { SenderDetails };
