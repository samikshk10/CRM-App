import Joi from "joi";
import { numberSchema, stringSchema } from ".";

const createTag = Joi.object({
  name: stringSchema.label("Name").required(),
  color: stringSchema.label("Color").required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});

const updateTag = Joi.object({
  id: numberSchema.label("Tag Id"),
  name: stringSchema.label("Name"),
  color: stringSchema.label("Color").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});

const deleteTag = Joi.object({
  id: numberSchema.label("Tag Id").required(),
});

export { createTag, updateTag, deleteTag };