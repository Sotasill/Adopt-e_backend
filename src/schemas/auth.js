import Joi from 'joi';
import {
  ROLES,
  ANIMAL_TYPES,
  SPECIALIST_TYPES,
  VALIDATION_PATTERNS,
} from '../constants/common.js';

const baseUserSchema = {
  username: Joi.string()
    .pattern(VALIDATION_PATTERNS.USERNAME)
    .required()
    .messages({
      'string.pattern.base':
        'Username must start with capital letter and contain only letters, numbers, underscore and dash',
    }),
  email: Joi.string().pattern(VALIDATION_PATTERNS.EMAIL).required().messages({
    'string.pattern.base': 'Please enter a valid email address',
  }),
  password: Joi.string()
    .pattern(VALIDATION_PATTERNS.PASSWORD)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long and contain at least one letter and one number',
    }),
  acceptTerms: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must accept the terms and conditions',
  }),
};

export const registerUserSchema = Joi.object({
  ...baseUserSchema,
  role: Joi.string().valid(ROLES.USER).default(ROLES.USER),
});

export const registerBreederSchema = Joi.object({
  ...baseUserSchema,
  role: Joi.string().valid(ROLES.BREEDER).default(ROLES.BREEDER),
  companyName: Joi.string()
    .pattern(VALIDATION_PATTERNS.COMPANY_NAME)
    .required()
    .messages({
      'string.pattern.base': 'Company name must start with capital letter',
    }),
  specialization: Joi.string()
    .valid(...Object.values(ANIMAL_TYPES))
    .required(),
  country: Joi.string()
    .pattern(VALIDATION_PATTERNS.COUNTRY)
    .required()
    .messages({
      'string.pattern.base': 'Country must start with capital letter',
    }),
  city: Joi.string().pattern(VALIDATION_PATTERNS.CITY).messages({
    'string.pattern.base': 'City must start with capital letter',
  }),
});

export const registerSpecialistSchema = Joi.object({
  ...baseUserSchema,
  role: Joi.string().valid(ROLES.SPECIALIST).default(ROLES.SPECIALIST),
  companyName: Joi.string()
    .pattern(VALIDATION_PATTERNS.COMPANY_NAME)
    .required()
    .messages({
      'string.pattern.base': 'Company name must start with capital letter',
    }),
  specialization: Joi.string()
    .valid(...Object.values(SPECIALIST_TYPES))
    .required(),
  country: Joi.string()
    .pattern(VALIDATION_PATTERNS.COUNTRY)
    .required()
    .messages({
      'string.pattern.base': 'Country must start with capital letter',
    }),
  city: Joi.string().pattern(VALIDATION_PATTERNS.CITY).messages({
    'string.pattern.base': 'City must start with capital letter',
  }),
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
