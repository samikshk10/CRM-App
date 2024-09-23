import Joi from "joi";
import { numberSchema } from ".";

const CreateContactSocialIdentities = Joi.object({
    userSocialCredentialId: numberSchema.label("User Social Credential Id").required(),

});

const UpdateContactSocialIdentities = Joi.object({
    userSocialCredentialId: numberSchema.label("User Social Credential Id"),
    meta: Joi.object({}).unknown(true).label("Meta"),
});

const DeleteContactSocialIdentities = Joi.object({
    id: numberSchema.label("id").required(),
});

export { CreateContactSocialIdentities, UpdateContactSocialIdentities, DeleteContactSocialIdentities };