import Joi, { date } from "joi";
import { arraySchema, dateSchema, numberSchema, stringSchema } from ".";

const createTask = Joi.object({
  description: stringSchema.label("Description").required(),
  contactId: numberSchema.label("Contact Id").required(),
  title: stringSchema.label("Title").required(),
  typeId: numberSchema.label("Type Id").required(),
  tagId: numberSchema.label("Tag Id").required(),
  assigneeId: numberSchema.label("Assignee Id"),
  dueDate: dateSchema.label("Due Date").format(["YYYY/MM/DD", "DD-MM-YYYY", "YYYY/MM/DD HH:mm"]).required(),
  reminderDate: dateSchema.label("Reminder Date").format(["YYYY/MM/DD", "DD-MM-YYYY", "YYYY/MM/DD HH:mm"]).required(),
  parentId: numberSchema.label("Parent Id"),
  reporterId: numberSchema.label("Reporter Id").allow(null).optional(),
  level: numberSchema.label("Level").allow(null).optional(),
  pipelineId: numberSchema.label("Pipeline Id").required(),
  completedDate: dateSchema.label("Completed Date").allow(null).format(["YYYY/MM/DD", "DD-MM-YYYY","YYYY/MM/DD HH:mm"]).optional(),
  subTasks: arraySchema.label("SubTasks").optional()
});

const updateTask = Joi.object({
  description: stringSchema.label("Description").allow(null, "").optional(),
  contactId: numberSchema.label("Contact Id").allow(null).optional(),
  title: stringSchema.label("Title").required(),
  typeId: numberSchema.label("Type Id").required(),
  tagId: numberSchema.label("Tag Id").required(),
  assigneeId: numberSchema.label("Assignee Id").required(),
  dueDate: dateSchema.label("Due Date").format(["YYYY/MM/DD", "DD-MM-YYYY", "YYYY/MM/DD HH:mm"]).required(),
  pipelineId: numberSchema.label("Pipeline Id").required(),
  reporterId: numberSchema.label("Reporter Id").allow(null).optional(),
  reminderDate: dateSchema.label("Reminder Date").format(["YYYY/MM/DD", "DD-MM-YYYY", "YYYY/MM/DD HH:mm"]).required(),
  level: numberSchema.label("Level").required(),
  completedDate: dateSchema
    .label("Completed Date")
    .allow(null)
    .format(["YYYY/MM/DD", "DD-MM-YYYY", "YYYY/MM/DD HH:mm"])
    .optional(),
  subTasks: arraySchema.label("SubTasks"),
});

const deleteTask = Joi.object({
  id: numberSchema.label("Task Id").required(),
});

const uploadTaskAttachment = Joi.object({
  attachmentId: numberSchema.label("Attachment id").required(),
  taskId: numberSchema.label("Task id").required(),
});

export { createTask, updateTask, deleteTask, uploadTaskAttachment };
