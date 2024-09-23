import Joi from "joi";
import { numberSchema, stringSchema } from ".";

const createMilestone = Joi.object({
  name: stringSchema.label("Name").required(),
  pipelineId: numberSchema.label("Pipeline Id").required(),
  ownerId: numberSchema.label("Owner Id").required(),
});

const updateMilestone = Joi.object({
  name: stringSchema.label("Name").optional(),
  pipelineId: numberSchema.label("PipelineId").optional(),
});

const deleteMilestone = Joi.object({
  id: numberSchema.label("Milestone Id").required(),
});

const updateMilestoneRank = Joi.object({
  draggedId: numberSchema.label("Dragged Milestone Id").required(),
  higherPivotRank: numberSchema
    .label("Higher Pivot Milestone Rank")
    .allow(null)
    .required(),
  lowerPivotRank: numberSchema
    .label("Lower Pivot Milestone Rank")
    .allow(null)
    .required(),
  pipelineId: numberSchema.label("Pipeline Id").required(),
});

export {
  createMilestone,
  updateMilestone,
  deleteMilestone,
  updateMilestoneRank,
};
