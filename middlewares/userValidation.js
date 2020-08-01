const Joi = require('@hapi/joi');

// Register validation
const registerValidation = (data) => {
  const userValidationSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string()
      .min(6)
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(6).required(),
  });

  return userValidationSchema.validate(data);
};

// Register validation
const loginValidation = (data) => {
  const userValidationSchema = Joi.object({
    name: Joi.string().min(6),
    email: Joi.string()
      .min(6)
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(6).required(),
  });

  return userValidationSchema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
};
