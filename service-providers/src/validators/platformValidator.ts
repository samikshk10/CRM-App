import Joi from "joi";
import { stringSchema, booleanSchema } from ".";

const CreatePlatform = Joi.object({
    name: stringSchema.label("Name").required(),
    active: booleanSchema.label("Active"),
    avatarUrl: stringSchema.label("Avatar Url"),
});

const UpdatePlatform = Joi.object({
    name: stringSchema.label("Name").optional(),
    active: booleanSchema.label("Active"),
    avatarUrl: stringSchema.label("Avatar Url"),
});

const DeletePlatform = Joi.object({
    id: stringSchema.label("Id").required(),
});
export {
    CreatePlatform,
    UpdatePlatform,
    DeletePlatform
}