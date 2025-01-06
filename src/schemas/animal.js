import Joi from 'joi';
import { Types } from 'mongoose';
import Animal from '../models/animal.js';

const isValidObjectId = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const isUniqueMicrochip = async (value, helpers) => {
  if (!value) return value;
  const existingAnimal = await Animal.findOne({ microchip: value });
  if (existingAnimal) {
    throw new Error('Животное с таким номером микрочипа уже существует');
  }
  return value;
};

const animalAddSchema = Joi.object({
  mother: Joi.string().custom(isValidObjectId).allow(null),
  father: Joi.string().custom(isValidObjectId).allow(null),
  motherRegistered: Joi.boolean().default(false),
  fatherRegistered: Joi.boolean().default(false),
  name: Joi.string().required(),
  breed: Joi.string().required(),
  sex: Joi.string().valid('male', 'female').required().messages({
    'any.required': 'Пол животного обязателен',
    'any.only': 'Пол животного должен быть male или female',
  }),
  birthDate: Joi.date().required(),
  type: Joi.string().valid('cat', 'dog'),
  litterRegistrationNumber: Joi.string(),
  microchip: Joi.string().external(isUniqueMicrochip),
  furColor: Joi.string(),
  eyeColor: Joi.string().required(),
  furLength: Joi.string(),
});

const animalUpdateSchema = Joi.object({
  name: Joi.string(),
  breed: Joi.string(),
  sex: Joi.string().valid('male', 'female'),
  birthDate: Joi.date(),
  mother: Joi.string().custom(isValidObjectId),
  father: Joi.string().custom(isValidObjectId),
  motherRegistered: Joi.boolean(),
  fatherRegistered: Joi.boolean(),
  microchip: Joi.string().external(isUniqueMicrochip),
  furColor: Joi.string(),
  eyeColor: Joi.string(),
  furLength: Joi.string(),
});

const checkAnimalNameSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Имя животного обязательно',
    'string.empty': 'Имя животного не может быть пустым',
  }),
});

export { animalAddSchema, animalUpdateSchema, checkAnimalNameSchema };
