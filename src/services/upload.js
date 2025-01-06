import cloudinary from 'cloudinary';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../constants/animals.js';
import { HttpError } from '../utils/errorHandler.js';

const v2 = cloudinary.v2;

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async file => {
  // Проверка типа файла
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new HttpError(
      400,
      `Unsupported file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    );
  }

  // Проверка размера файла
  if (file.size > MAX_IMAGE_SIZE) {
    throw new HttpError(
      400,
      `File too large. Maximum size: ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    );
  }

  try {
    const result = await v2.uploader.upload(file.path, {
      folder: 'animals',
      allowed_formats: ['jpg', 'png', 'webp'],
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto:good' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new HttpError(500, 'Error uploading image');
  }
};

const deleteImage = async publicId => {
  if (!publicId) return;

  try {
    await v2.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export { uploadImage, deleteImage };
