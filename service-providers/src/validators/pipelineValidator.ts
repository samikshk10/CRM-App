import Joi from "joi";
import { arraySchema, numberSchema, stringSchema } from ".";

const CreatePipeline = Joi.object({
  name: stringSchema.label("Name").required(),
  level: numberSchema.label("Level"),
  parentId: numberSchema.label("parent Id").allow(null),
  ownerId: numberSchema.label("owner Id").required(),
});
const createPipelineMilestones = Joi.object({
  name: stringSchema.label("Name").required(),
  level: numberSchema.label("Level"),
  parentId: numberSchema.label("Parent Id").allow(null),
  ownerId: numberSchema.label("Owner Id").required(),
  milestones: arraySchema.label("Milestones")
});
const UpdatePipeline = Joi.object({
  name: stringSchema.label("Name").optional(),
  level: numberSchema.label("Level"),
  parentId: numberSchema.label("Parent Id").allow(null),
});

const DeletePipeline = Joi.object({
  id: numberSchema.label("Pipeline Id").required(),
});

export { CreatePipeline, UpdatePipeline,createPipelineMilestones, DeletePipeline };
