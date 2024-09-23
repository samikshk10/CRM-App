import express, { Request, Response, Router } from "express";
import { ContactSocialIdentitiesRepository, PlatformRepository } from "@src/repositories";
import { WhatsappUserDetailInterface } from "@src/interfaces";
import { PubSub } from "@src/config";
import Model from "@src/models";
import providerService from "@src/services/providerService";
import { ContactSocialIdentitiesService } from "@src/services";
import senderDetails from "@src/providers/whatsapp/senderDetail";
import { WhatsappMessage } from "@src/providers/whatsapp/message";
const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {

        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];
        if (mode && token) {
            const platform = await new PlatformRepository().findOne({
                where: {
                    slug: "whatsapp",
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
                console.log("WEBHOOK_VERIFIED");
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
        if (!body.entry[0].changes[0].value?.statuses) {
            let query = body.entry[0].changes[0].value.messages[0].text;
            const senderId = body.entry[0].id;
            const phoneNumber = body.entry[0].changes[0].value.messages[0].from;

            res.status(200).send("OK");
        }

        else {
            return;
        }
    } catch (error) {
        console.error("Error processing webhook payload:", error);
        res.sendStatus(500);
    }
});

export { router };
