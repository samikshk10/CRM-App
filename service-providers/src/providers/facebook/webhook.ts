import axios from "axios";
import express, { Request, Response, Router } from "express";
import { ContactSocialIdentitiesRepository, PlatformRepository } from "@src/repositories";
import { FacebookUserDetailInterface, FacebookConversationIdInterface } from "@src/interfaces";
import { PubSub } from "@src/config";
import { FacebookMessage } from ".";
import { SenderDetails } from "@src/providers";
import providerService from "@src/services/providerService";
import { ContactSocialIdentitiesService } from "@src/services";
import Model from "@src/models";
import { facebook } from "@src/config";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode && token) {
      const platform = await new PlatformRepository().findOne({
        where: {
          slug: "facebook",
        },
        include: [
          {
            model: Model.UserSocialCredential,
            as: "userSocialCredential",
            attributes: ["credentials"],
          },
        ],
      });
      const verify_token = platform.userSocialCredential?.credentials.verifyToken;
      if (mode === "subscribe" && token === verify_token) {
        console.info("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error("Error in webhook verification:", error);
    res.sendStatus(500);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let query = body.entry[0].messaging[0].message.text;
    const psId = body.entry[0].messaging[0].sender.id;
    const pageId = body.entry[0].id;
    const credential = await providerService.senderDetails(pageId);
    const accessToken = credential.credentials.pageAccessToken;
    const getSenderInput: FacebookUserDetailInterface = {
      psId: psId,
      accessToken: accessToken,
    };
    const result = await new SenderDetails(getSenderInput).getSenderDetails();
    const attachmentUrl = body.entry[0]?.messaging[0]?.message?.attachments;
    if (attachmentUrl) {
      query = attachmentUrl[0].payload.url;
    }
    const pageAccessToken = credential.credentials.pageAccessToken;
    let findSender = await new ContactSocialIdentitiesRepository().findOne({
      where: {
        userSocialCredentialId: credential.id,
        contactAccessId: psId,
      },
    });
    console.info(query);
    if (!findSender) {
      const input: FacebookConversationIdInterface = {
        pageId: pageId,
        senderId: psId,
        pageAccessToken: pageAccessToken,
      };
      const conversationIds = await axios.get(
        `${facebook.baseUrl}/v13.0/${input.pageId}/conversations?platform=messenger&user_id=${input.senderId}&access_token=${input.pageAccessToken}`,
      );
      const conversationId = conversationIds.data.data[0].id;
      findSender = await new ContactSocialIdentitiesService().create({
        userSocialCredentialId: credential.id,
        ownerId: credential.ownerId,
        contactAccessId: psId,
        meta: {
          name: `${result.first_name} ${result.last_name}`,
          profilePic: result.profile_pic,
          gender: result.gender,
          conversationId: conversationId,
        },
      });
    }
    const response = await new FacebookMessage({}).MessageWebhook({
      contactId: findSender.id,
      message: query,
      result: result,
    });
    PubSub.RedisPubSub.publish("NEW_MESSAGE", {
      webhookMessage: response,
    });
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error processing webhook payload:", error);
    res.sendStatus(500);
  }
});

export default router;
