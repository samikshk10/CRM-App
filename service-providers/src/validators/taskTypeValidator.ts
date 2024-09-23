import Joi, { date } from "joi";
import { dateSchema, numberSchema, stringSchema } from ".";

const createTaskType = Joi.object({
  label: stringSchema.label("Description"),
  ownerId: numberSchema.label("Owner Id"),
});

const updateTaskType = Joi.object({
  label: stringSchema.label("Description"),
});

const deleteTaskType = Joi.object({
  id: numberSchema.label("Type Id").required(),
});

export { createTaskType, updateTaskType, deleteTaskType };
