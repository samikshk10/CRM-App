import Joi from "joi";
import { numberSchema, stringSchema, } from ".";

const createChatMessage = Joi.object({
    chatSessionId: numberSchema.label("Chat Session Id").required(),
    senderId: numberSchema.label("Sender Id").required(),
    content: stringSchema.label("Content").required(),
    messageType: stringSchema.label("Message Type").required(),
    ownerId: numberSchema.label("Owner Id").required(),
    direction: stringSchema.label("Direction").optional(),
});

const updateChatMessage = Joi.object({
    chatSessionId: numberSchema.label("Chat Session Id").required(),
    senderId: numberSchema.label("Sender Id").required(),
    content: stringSchema.label("Content").required(),
    messageType: stringSchema.label("Message Type").required(),
    ownerId: numberSchema.label("Owner Id").optional(),
    direction: stringSchema.label("Direction").optional(),
});

export { createChatMessage, updateChatMessage };