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

const userInvite = Joi.object({
    email: Joi.string().required(),
  });

const passwordResetSchema = Joi.object({
  new_password: Joi.string().min(6).required(),
  otp_code: Joi.string().required(),
});

const ForgotPasswordSchema = Joi.object({
  email: Joi.string().required(),
});

const UpdateUserSchema = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string(),
  location: Joi.string(),
  birthday: Joi.date(),
  gender: Joi.string(),
  profile_pic: Joi.string(),
});

module.exports = {
  UserSignupSchema,
  LoginSchema,
  userInvite,
  passwordResetSchema,
  ForgotPasswordSchema,
  UpdateUserSchema
};
