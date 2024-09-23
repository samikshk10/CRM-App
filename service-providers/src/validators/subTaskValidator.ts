import Joi from "joi";
import { booleanSchema, numberSchema, stringSchema } from ".";

const createSubTaskValidator = Joi.object({
  description: stringSchema.label("Description").required(),
  taskId: numberSchema.label("Task Id"),
  completed: booleanSchema.label("Completed"),
  ownerId: numberSchema.label("Owner Id").required(),
});

const updateSubTaskValidator = Joi.object({
  description: stringSchema.label("Description"),
  taskId: numberSchema.label("Task Id"),
  completed: booleanSchema.label("Completed"),
});

export { createSubTaskValidator, updateSubTaskValidator };
