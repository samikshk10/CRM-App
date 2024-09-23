import Joi from "joi";
import { arraySchema, booleanSchema, dateSchema, forbiddenSchema, numberSchema, stringSchema } from ".";

const createDeal = Joi.object({
  name: stringSchema.label("Name").required(),
  contactId: numberSchema.label("Contact id").optional(),
  company: stringSchema.label("Company").optional(),
  value: numberSchema.label("Value").required(),
  pipelineId: numberSchema.label("Pipeline Id").required(),
  milestoneId: numberSchema.label("Milestone Id").required(),
  description: stringSchema.label("Description").optional(),
  ownerId: numberSchema.label("Owner Id").optional(),
  assigneeId: numberSchema.label("Assignee Id").optional(),
  reporterId: numberSchema.label("Reporter Id").optional(),
  closingDate: dateSchema.label("Closing date").optional(),
});

const updateDeal = Joi.object({
  name: stringSchema.label("name").required(),
  contactId: numberSchema.label("Contact Id").optional(),
  company: stringSchema.label("Company").optional(),
  value: numberSchema.label("Value").optional(),
  pipelineId: numberSchema.label("Pipeline Id").optional(),
  milestoneId: numberSchema.label("Milestone Id").optional(),
  description: stringSchema.label("Description").optional(),
  ownerId: numberSchema.label("Owner Id").optional(),
  assigneeId: numberSchema.label("Assignee Id").optional(),
  reporterId: numberSchema.label("Reporter Id").optional(),
  closingDate: dateSchema.label("Closing date").optional(),
});

const deleteDeal = Joi.object({
  id: arraySchema.label("Deal Id").required(),
});

const updateDealMilestone = Joi.object({
  milestoneId: numberSchema.label("Milestone Id").required(),
  pipelineId: numberSchema.label("Pipeline Id").required(),
});

const updateDealDecision = Joi.object({
  won: booleanSchema.label("Won").required(),
  price: Joi.when("won", {
    is: true,
    then: numberSchema.label("Price").required(),
    otherwise: forbiddenSchema,
  }),
  description: Joi.when("won", {
    is: false,
    then: stringSchema.label("Description").required(),
    otherwise: forbiddenSchema,
  }),
});

const updateDealRank = Joi.object({
  draggedId: numberSchema.label("Dragged Deal Id").required(),
  higherPivotRank: numberSchema.label("Higher Pivot Deal Rank").allow(null).required(),
  lowerPivotRank: numberSchema.label("Lower Pivot Deal Rank").allow(null).required(),
  pipelineId: numberSchema.label("Pipeline Id").required(),
  milestoneId: numberSchema.label("Milestone Id").required(),
});

const dealByMultipleId = Joi.object({
  pipeline: arraySchema.label("Pipeline Ids").optional(),
  milestone: arraySchema.label("Milestone Ids").optional(),
});

export {
  createDeal,
  updateDeal,
  deleteDeal,
  updateDealRank,
  updateDealMilestone,
  dealByMultipleId,
  updateDealDecision,
};
