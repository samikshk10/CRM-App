import { WhatsappWebhookPageSubscriptionInterface } from '@src/interfaces';
import { GraphQLError } from 'graphql';
import {
  FacebookAppAccessInterface,
  UserSocialCredentialInterface,
  InputUserSocialCredentialInterface,
  UpdateUserSocialCredentialInterface,
  WebhookSubscriptionInterface,
  FacebookLongLivedTokenInterface,
  FacebookPagesInterface,
  FacebookWebhookPageSubscriptionInterface,
  WhatsappBusinessInterface,
} from '@src/interfaces';
import { UserSocialCredentialRepository } from '@src/repositories';
import { AccessToken, PageDetail, WebhookSubscription } from '@src/providers';
import { PlatformService } from '.';
import { BusinessDetail } from '@src/providers/whatsapp';
import { WebhookSubscription as WhatsappWebhookSubscription } from '@src/providers/whatsapp';
import Platform from '@src/models/platform';

export class UserSocialCredentialService {
  private repository: UserSocialCredentialRepository;
  constructor() {
    this.repository = new UserSocialCredentialRepository();
  }
  public async create(input: InputUserSocialCredentialInterface): Promise<UserSocialCredentialInterface> {
    const tokenInput: FacebookLongLivedTokenInterface = {
      appId: input.appid,
      appSecret: input.appsecret,
      accessToken: input.accessToken,
    };

    const longLivedAccessToken = await new AccessToken(tokenInput).longLivedToken();

    const getPlatform = await new PlatformService().findByPk(input.platformId)
    let credentials: any = {};
    switch (getPlatform.slug) {
      case "facebook":
        const pagesInput: FacebookPagesInterface = {
          userId: input.userId,
          accessToken: longLivedAccessToken,
        };
        const getPages = await new PageDetail(pagesInput).getPageDetail();
        const pageId = getPages.data[0].id,
          pageName = getPages.data[0].name,
          pageAccessToken = getPages.data[0].access_token;
        const webhookInput: FacebookWebhookPageSubscriptionInterface = {
          pageId: pageId,
          pageAccessToken: pageAccessToken,
        };
        const webhookSubscribePage = await new WebhookSubscription(webhookInput).webhookPageSubscription();
        if (!webhookSubscribePage.success)
          throw new GraphQLError(`Please provide appId, appSecret and callbackURL!`, {
            extensions: {
              code: "BAD_USER_INPUT",
              status: 400,
              message: `Please provide appId, appSecret and callbackURL!`,
              attribute: "appId, appSecret and callbackURL",
            },
          });
        credentials = {
          appId: input.appid,
          appSecret: input.appsecret,
          callbackURL: input.callbackURL,
          userId: input.userId,
          displayName: input.displayName,
          accessToken: longLivedAccessToken,
          webhookStatus: input.webhookStatus ? input.webhookStatus : "Not Verified",
          verifyToken: input.verifyToken,
          webhookURL: input.webhookURL,
          pageId: pageId,
          pageName: pageName,
          pageAccessToken: pageAccessToken,
        };
        break;


      case "whatsapp":
        const whatsappInput: WhatsappBusinessInterface = {
          businessID: input.businessID,
          accessToken: longLivedAccessToken,
        }
        const getBusinessDetail = await BusinessDetail.getBusinessDetails(whatsappInput);
        const phoneId = getBusinessDetail.data[0].id,
          displayPhoneNumber = getBusinessDetail.data[0].display_phone_number;
        credentials = {
          appId: input.appid,
          appSecret: input.appsecret,
          callbackURL: input.callbackURL,
          userId: input.userId,
          displayName: input.displayName,
          accessToken: longLivedAccessToken,
          webhookStatus: input.webhookStatus ? input.webhookStatus : 'Not Verified',
          verifyToken: input.verifyToken,
          webhookURL: input.webhookURL,
          phoneId: phoneId,
          displayPhoneNumber: displayPhoneNumber,
          businessID: input.businessID,
        };
        break;
    }
    const createCredential = await this.repository.create({
      ownerId: input.ownerId,
      platformId: input.platformId,
      credentials: credentials,
    });
    if (!createCredential)
      throw new GraphQLError(`Please provide appId, appSecret and callbackURL!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Please provide appId, appSecret and callbackURL!`,
          attribute: "appId, appSecret and callbackURL",
        },
      });

    return createCredential;
  }

  public async findByPk(id: number): Promise<UserSocialCredentialInterface> {
    const credential = await this.repository.findByPk(id);
    if (!credential)
      throw new GraphQLError(`Credential: ${id} does not exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Credential ${id} does not exist!`,
          attribute: "id",
        },
      });
    return credential;
  }

  public async findAll(): Promise<UserSocialCredentialInterface[]> {
    const credentials = await this.repository.findAll({});
    if (!credentials)
      throw new GraphQLError(`Credentials does not exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Credentials does not exist!`,
          attribute: "credentials",
        },
      });
    return credentials;
  }
  public async updateOne(
    id: number,
    input: UpdateUserSocialCredentialInterface,
  ): Promise<UserSocialCredentialInterface> {
    const credential = await this.repository.findByPk(id);
    if (!credential)
      throw new GraphQLError(`Credential: ${id} does not exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Credential ${id} does not exist!`,
          attribute: "id",
        },
      });
    if (input.credentials) {
      const oldObj = credential.credentials;
      const newObj = input.credentials;
      const updateObj = { ...oldObj, ...newObj };
      input.credentials = updateObj;
    }
    await this.repository.updateOne({ id, input });
    return this.findByPk(id);
  }

  public async delete(id: number): Promise<boolean> {
    const credential = await this.repository.findByPk(id);
    if (!credential)
      throw new GraphQLError(`Credential: ${id} does not exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Credential ${id} does not exist!`,
          attribute: "id",
        },
      });
    const removeCredential = await this.repository.deleteOne(id);
    return removeCredential === 0 ? false : true;
  }
  public async SubscribeWebhook(platformId: number): Promise<UserSocialCredentialInterface> {
    const credential = await this.repository.findOne({
      where: {
        platformId,
      },
    });
    if (!credential)
      throw new GraphQLError(`Credential: does not exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Credential does not exist!`,
          attribute: "credential",
        },
      });

    const facebookAppId = credential.credentials.appId;
    const facebookAppSecret = credential.credentials.appSecret;
    const input: FacebookAppAccessInterface = {
      appId: facebookAppId,
      appSecret: facebookAppSecret,
    };
    const appAccessToken = await new AccessToken(input).appAccessToken();
    const callback_url = credential.credentials.webhookURL;
    const webhookInput: WebhookSubscriptionInterface = {
      appId: facebookAppId,
      verifyToken: credential.credentials.verifyToken,
      accessToken: appAccessToken,
    };

    const getPlatform = await new PlatformService().findByPk(platformId);

    let webhookSubscribedResponse;
    switch (getPlatform.slug) {
      case "facebook":
        webhookSubscribedResponse = await new WebhookSubscription(webhookInput).webhookSubscription(callback_url);
        break;

      case "whatsapp":
        webhookSubscribedResponse = await new WhatsappWebhookSubscription(webhookInput).webhookSubscription(callback_url);
        break;
    }

    if (webhookSubscribedResponse.success) {
      const oldObj = credential.credentials;
      const newObj = {
        webhookStatus: "Verified",
      };
      const updateObj = { ...oldObj, ...newObj };
      credential.credentials = updateObj;
      await this.repository.updateOne({ id: credential.id, input: { credentials: updateObj } });
    }
    return this.findByPk(credential.id);

  }
}
