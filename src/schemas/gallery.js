import Joi from 'joi';
import { Types } from 'mongoose';

const isValidObjectId = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const galleryImageSchema = Joi.object({
  url: Joi.string().required(),
  public_id: Joi.string().required(),
  type: Joi.string().valid('main', 'gallery').default('gallery'),
  createdAt: Joi.date().default(Date.now),
});

// Для POST запроса нам не нужна валидация файлов, так как это делает multer
const addToGallerySchema = Joi.object({
  animalId: Joi.string().custom(isValidObjectId).required(),
});

const deleteFromGallerySchema = Joi.object({
  animalId: Joi.string().custom(isValidObjectId).required(),
  imageId: Joi.string().required(),
});

export { galleryImageSchema, addToGallerySchema, deleteFromGallerySchema };
