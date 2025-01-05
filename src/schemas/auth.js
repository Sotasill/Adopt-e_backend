import Joi from 'joi';
import { passwordRegexp } from '../constants/users.js';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegexp).required(),
  phone: Joi.string().required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().required(),
});
