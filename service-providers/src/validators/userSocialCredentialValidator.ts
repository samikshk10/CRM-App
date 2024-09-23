import Joi from "joi";
import { numberSchema, stringSchema } from ".";
const CreateUserSocialCredential = Joi.object({
    appid: stringSchema.label("appid").required(),
    appsecret: stringSchema.label("appsecret").required(),
    callbackURL: stringSchema.label("callbackURL").required(),
    platformId: numberSchema.label("platformId").required(),
    webhookURL: stringSchema.label("webhookURL"),
    verifyToken: stringSchema.label("verifyToken").required(),
    accessToken: stringSchema.label("accessToken").required(),
    userId: stringSchema.label("userId").required(),
    displayName: stringSchema.label("displayName").required(),
    businessID: stringSchema.label("Business ID").optional()
});

const UpdateUserSocialCredential = Joi.object({
    id: numberSchema.label("Id"),
    platformId: numberSchema.label("Platform Id"),
    credentials: Joi.object({}).unknown(true).label("Credentials"),
});

const DeleteUserSocialCredential = Joi.object({
    id: numberSchema.label("id").required(),
});
export { CreateUserSocialCredential, UpdateUserSocialCredential, DeleteUserSocialCredential };