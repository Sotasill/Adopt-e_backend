import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validateBody.js';
import { isValidId } from '../middleware/isValidId.js';
import {
  animalAddSchema,
  animalUpdateSchema,
  checkAnimalNameSchema,
} from '../schemas/animal.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addAnimal,
  getBreederAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
  checkAnimalName,
  getUserAnimals,
} from '../controllers/animals.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Настройка Multer для загрузки файлов
const upload = multer({
  dest: path.join(process.cwd(), 'tmp'),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.use(authenticate);

router.get('/user', ctrlWrapper(getUserAnimals));

router.post(
  '/',
  upload.single('image'),
  validateBody(animalAddSchema),
  ctrlWrapper(addAnimal)
);
router.get('/', ctrlWrapper(getBreederAnimals));
router.get('/:animalId', isValidId('animalId'), ctrlWrapper(getAnimalById));
router.put(
  '/:animalId',
  isValidId('animalId'),
  upload.single('image'),
  validateBody(animalUpdateSchema),
  ctrlWrapper(updateAnimal)
);
router.delete(
  '/:animalId',
  isValidId('animalId'),
  (req, res, next) => {
    // Пропускаем JSON middleware для DELETE запросов
    req.skipJSONParsing = true;
    next();
  },
  ctrlWrapper(deleteAnimal)
);
router.post(
  '/check-name',
  authenticate,
  validateBody(checkAnimalNameSchema),
  ctrlWrapper(checkAnimalName)
);

export { router as animalsRouter };
