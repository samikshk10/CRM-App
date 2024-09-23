import Joi from "joi";
import { dateSchema, numberSchema, stringSchema } from ".";

const createContactNote = Joi.object({
  description: stringSchema.label("Description").required(),
  contactId: numberSchema.label("Contact Id").required(),
  date: dateSchema.label("Date").format(["YYYY/MM/DD", "DD-MM-YYYY"]).optional(),
});

const updateContactNote = Joi.object({
  description: stringSchema.label("Description").allow(null, ""),
  contactId: numberSchema.label("Contact Id").allow(null),
  date: dateSchema.label("Date").format(["YYYY/MM/DD", "DD-MM-YYYY"]),

});

const deleteContactNote = Joi.object({
  id: numberSchema.label("Note Id").required(),
});

export { createContactNote, updateContactNote, deleteContactNote };