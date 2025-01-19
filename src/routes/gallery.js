import express from 'express';
import { authenticate } from '../middleware/index.js';
import { upload } from '../middleware/upload.js';
import {
  addToGallery,
  getGallery,
  deleteFromGallery,
} from '../controllers/gallery.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.use(authenticate);

// Загрузка изображений в галерею
router.post('/:animalId', upload, ctrlWrapper(addToGallery));

// Получение всех изображений животного
router.get('/:animalId', ctrlWrapper(getGallery));

// Удаление изображения из галереи
router.delete('/:animalId/:imageId', ctrlWrapper(deleteFromGallery));

export default router;
