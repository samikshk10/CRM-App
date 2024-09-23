import joiDate from "@joi/date";
import { domainRegex } from "@src/utils";
import joi from "joi";

const Joi = joi as typeof joi;
const JoiDate = Joi.extend(joiDate);

const stringSchema = Joi.string();

const numberSchema = Joi.number();

const booleanSchema = Joi.boolean();

const positiveIntegerSchema = Joi.number().integer().min(1);

const emailSchema = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
  .lowercase();

const phoneSchema = Joi.string()
  .min(7)
  .max(14)
  .pattern(/^([+]|[00]{2})([0-9]|[ -])*/);

const urlSchema = Joi.string().uri();

const domainSchema = Joi.string().regex(domainRegex).messages({
  'string.pattern.base': 'Invalid URL format',
});

const dateSchema = JoiDate.date().format([
  "YYYY/MM/DD",
  "YYYY-MM-DD",
  "YYYY/MM/DD HH:mm",
   "HH:mm"
]);

const timeSchema = JoiDate.date().format(["HH:mm:ss"]);

const dateAndTimeSchema = JoiDate.date();

const arraySchema = Joi.array();

const forbiddenSchema = Joi.forbidden();

export {
  stringSchema,
  numberSchema,
  positiveIntegerSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
  dateSchema,
  timeSchema,
  dateAndTimeSchema,
  arraySchema,
  booleanSchema,
  forbiddenSchema,
  domainSchema
};
