import Joi from 'joi';
import { passwordRegexp } from '../constants/users.js';

export const registerBreederSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegexp).required(),
  companyName: Joi.string().required(),
  address: Joi.string().required(),
  country: Joi.string().required(),
  specialization: Joi.string().valid('dog', 'cat').required(),
  role: Joi.string().valid('breeder').default('breeder'),
});

export const registerUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegexp).required(),
  role: Joi.string().valid('user').default('user'),
});

export const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().required(),
});
