import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import getEnvVars from './getEnvVars.js';

const CLOUDINARY_CLOUD_NAME = getEnvVars('CLOUDINARY_CLOUD_NAME');
const CLOUDINARY_API_KEY = getEnvVars('CLOUDINARY_API_KEY');
const CLOUDINARY_API_SECRET = getEnvVars('CLOUDINARY_API_SECRET');

// Дефолтные значения для размеров изображений
const DEFAULT_SIZES = {
  AVATAR_SIZE: 400,
  BACKGROUND_WIDTH: 1920,
  BACKGROUND_HEIGHT: 1080,
  ANIMAL_SIZE: 800,
};

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Создаем отдельные хранилища для разных типов файлов
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      {
        width: DEFAULT_SIZES.AVATAR_SIZE,
        height: DEFAULT_SIZES.AVATAR_SIZE,
        crop: 'fill',
      },
    ],
    format: 'webp', // Используем webp для лучшей оптимизации
    resource_type: 'auto',
    overwrite: true, // Перезаписываем файл если он существует
  },
});

const backgroundStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'backgrounds',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      {
        width: DEFAULT_SIZES.BACKGROUND_WIDTH,
        height: DEFAULT_SIZES.BACKGROUND_HEIGHT,
        crop: 'fill',
      },
    ],
    format: 'webp', // Используем webp для лучшей оптимизации
    resource_type: 'auto',
    overwrite: true, // Перезаписываем файл если он существует
  },
});

const animalStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'animal_pics',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      {
        width: DEFAULT_SIZES.ANIMAL_SIZE,
        height: DEFAULT_SIZES.ANIMAL_SIZE,
        crop: 'fill',
      },
    ],
    format: 'webp', // Используем webp для лучшей оптимизации
    resource_type: 'auto',
    overwrite: true, // Перезаписываем файл если он существует
  },
});

// Создаем middleware для каждого типа загрузки
const avatarUpload = multer({ storage: avatarStorage });
const backgroundUpload = multer({ storage: backgroundStorage });
const animalUpload = multer({ storage: animalStorage });

export { cloudinary, avatarUpload, backgroundUpload, animalUpload };
