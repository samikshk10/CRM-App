import Joi from "joi";
import { numberSchema, stringSchema } from ".";

const assignTagToContact = Joi.object({
  tagId: numberSchema.label("Tag Id").required(),
  contactId: numberSchema.label("Contact Id").required(),
});

const unassignTagToContact = Joi.object({
  tagId: numberSchema.label("Tag Id").required(),
  contactId: numberSchema.label("Contact Id").required(),
});

export { assignTagToContact, unassignTagToContact };
