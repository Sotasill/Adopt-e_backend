import Joi from 'joi';
import {
  ROLES,
  ANIMAL_TYPES,
  VALIDATION_PATTERNS,
} from '../constants/common.js';

export const registerBreederSchema = Joi.object({
  username: Joi.string().pattern(VALIDATION_PATTERNS.USERNAME).required(),
  email: Joi.string().pattern(VALIDATION_PATTERNS.EMAIL).required(),
  password: Joi.string().pattern(VALIDATION_PATTERNS.PASSWORD).required(),
  companyName: Joi.string().required(),
  address: Joi.string().required(),
  country: Joi.string().required(),
  specialization: Joi.string()
    .valid(ANIMAL_TYPES.CAT, ANIMAL_TYPES.DOG)
    .required(),
  role: Joi.string().valid(ROLES.BREEDER).default(ROLES.BREEDER),
});

export const registerUserSchema = Joi.object({
  username: Joi.string().pattern(VALIDATION_PATTERNS.USERNAME).required(),
  email: Joi.string().pattern(VALIDATION_PATTERNS.EMAIL).required(),
  password: Joi.string().pattern(VALIDATION_PATTERNS.PASSWORD).required(),
  role: Joi.string().valid(ROLES.USER).default(ROLES.USER).optional(),
});

export const loginSchema = Joi.object({
  username: Joi.string().pattern(VALIDATION_PATTERNS.USERNAME).required(),
  password: Joi.string().required(),
});

export const resetPasswordEmailSchema = Joi.object({
  email: Joi.string().pattern(VALIDATION_PATTERNS.EMAIL).required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().pattern(VALIDATION_PATTERNS.PASSWORD).required(),
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});
