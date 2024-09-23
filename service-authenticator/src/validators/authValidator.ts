import Joi from "joi";
import {
  booleanSchema,
  emailSchema,
  numberSchema,
  phoneSchema,
  positiveIntegerSchema,
  stringSchema,
} from "./schemas";

const signUp = Joi.object({
  name: stringSchema.label("Name").required(),
  email: emailSchema.label("Email").required().trim(),
  phoneNumber: phoneSchema.label("Phone Number").optional(),
  password: stringSchema.label("Password").required(),
});
const resendConfirmationCode = Joi.object({
  email: emailSchema.label("Email").required(),
});

const confirmSignUp = Joi.object({
  email: emailSchema.label("Email").required(),
  confirmationCode: stringSchema.required().label("Confirmation Code"),
});

const login = Joi.object({
  email: emailSchema.label("Email").email().required().trim(),
  password: stringSchema.label("Password").required(),
});

const authMe = Joi.object({
  name: stringSchema.label("Name").optional().allow("", null),
});

const changePassword = Joi.object({
  previousPassword: stringSchema.label("Previous Password").required(),
  proposedPassword: stringSchema.label("Proposed Password").required(),
});

const forgotPassword = Joi.object({
  email: emailSchema.label("Email"),
});

const confirmForgotPassword = Joi.object({
  verificationCode: stringSchema.label("Verification Code"),
  newPassword: stringSchema.label("New Password"),
  email: emailSchema.label("Email"),
});



export {
  signUp,
  confirmSignUp,
  resendConfirmationCode,
  login,
  authMe,
  changePassword,
  forgotPassword,
  confirmForgotPassword,
  
};
