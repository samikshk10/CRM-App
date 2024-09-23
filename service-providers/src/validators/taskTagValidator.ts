import Joi from "joi";
import { arraySchema, numberSchema } from ".";

const assignTagToTask = Joi.object({
  tagId: arraySchema.label("Tag id").required(),
  taskId: numberSchema.label("Task id").required(),
});

export { assignTagToTask };
