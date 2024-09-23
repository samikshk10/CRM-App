import Joi from "joi";
import { numberSchema, stringSchema, } from ".";

const createChatSession = Joi.object({
  ownerId: numberSchema.label("Owner Id").required(),
  contactId: numberSchema.label("Contact Id").required(),
  messagePlatformId: numberSchema.label("Message Platform Id"),
  assigneeId: numberSchema.label("Assigned Id"),
  reporterId: numberSchema.label("Reporter Id"),
  status: stringSchema.label("Status").optional(),
});

const updateChatSession = Joi.object({
  ownerId: numberSchema.label("Owner Id").optional(),
  contactId: numberSchema.label("Contact Id").optional(),
  messagePlatformId: numberSchema.label("Message Platform Id"),
  assigneeId: numberSchema.label("Assigned Id").optional(),
  reporterId: numberSchema.label("Reporter Id").optional(),
  status: stringSchema.label("Status").optional(),
});

export { createChatSession, updateChatSession };