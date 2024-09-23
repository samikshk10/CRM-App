import Joi from "joi";
import { emailSchema, phoneSchema, stringSchema, urlSchema, domainSchema, numberSchema } from "./";

const createContact = Joi.object({
  name: stringSchema.label("Name").required(),
  email: emailSchema.label("Email").required().trim(),
  address: stringSchema.label("Address").optional(),
  contactNumber: phoneSchema.label("Contact Number").required(),
  companyDomain: domainSchema.label("Company Domain").optional(),
  company: stringSchema.label("Company").optional(),
  profilePictureId: numberSchema.label("Profile Picture id").optional(),
});

const updateContact = Joi.object({
  name: stringSchema.label("Name").optional(),
  email: emailSchema.label("Email").optional().trim(),
  address: stringSchema.label("Address").optional(),
  contactNumber: phoneSchema.label("Contact Number").optional(),
  companyDomain: domainSchema.label("Company Domain").optional(),
  company: stringSchema.label("Company").optional(),
  profilePictureId: numberSchema.label("Profile Picture id").optional(),
});

const uploadAttachment = Joi.object({
  attachmentId: numberSchema.label("Attachment id").required(),
  contactId: numberSchema.label("Contact id").required(),
});

export { createContact, updateContact, uploadAttachment };
