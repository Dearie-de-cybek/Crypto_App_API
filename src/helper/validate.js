const Joi = require("joi");

const UserSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  security_pin: Joi.string().required(),
});



const LoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});



const passwordResetSchema = Joi.object({
  new_password: Joi.string().min(6).required(),
  otp_code: Joi.string().required(),
});

const ForgotPasswordSchema = Joi.object({
  email: Joi.string().required(),
});

module.exports = {
  UserSignupSchema,
  LoginSchema,
  passwordResetSchema,
  ForgotPasswordSchema,
};
