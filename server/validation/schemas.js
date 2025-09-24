const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
  skills: Joi.array().items(Joi.string()).default([]),
  careerPath: Joi.string().required()
});

const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  careerPath: Joi.string().optional()
});

const questCompleteSchema = Joi.object({
  questId: Joi.string().required()
});

module.exports = {
  userRegistrationSchema,
  userUpdateSchema,
  questCompleteSchema
};