import { GraphQLError } from "graphql"
import { UserSocialCredentialRepository } from "@src/repositories";
import { UserSocialCredentialInterface } from "@src/interfaces";

class ProviderService {
    private static instance: ProviderService;

    static get(): ProviderService {
        if (!ProviderService.instance) {
            ProviderService.instance = new ProviderService();
        }
        return ProviderService.instance;
    }
    async senderDetails(input: string): Promise<UserSocialCredentialInterface> {
        const credential = await new UserSocialCredentialRepository().findOne({
            "where": {
                credentials: {
                    "pageId": input
                }
            }
        })
        if (!credential)
            throw new GraphQLError(`Credential: ${input} does not exist!`, {
                extensions: {
                    code: "BAD_USER_INPUT",
                    status: 400,
                    message: `Credential ${input} does not exist!`,
                    attribute: "pageId",
                },
            });
        return credential
    }

}

const providerService = ProviderService.get();
export default providerService