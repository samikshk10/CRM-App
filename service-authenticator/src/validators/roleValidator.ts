import Joi from "joi";
import {
  numberSchema,
  stringSchema,
} from "./schemas";

const createRole = Joi.object({
    label: stringSchema.label("label").required(),
    level: numberSchema.label("level").required(),
    position: numberSchema.label("position").required(),
  });
  
  const updateRole = Joi.object({
    label: stringSchema.label("label"),
    level: numberSchema.label("level"),
    position: numberSchema.label("position"),
  });
  export {
    createRole,
    updateRole,
  };