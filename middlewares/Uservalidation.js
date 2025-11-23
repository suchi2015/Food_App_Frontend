const Joi = require('joi');

const UserValidation = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(4)
    .max(10)
    // .pattern(/^[a-zA-Z0-9@#$%^&*]+$/)
    .required(),
      role: Joi.string().valid('client', 'admin', 'vendor', 'driver').optional()
},{timestamps:true});

module.exports = { UserValidation };
