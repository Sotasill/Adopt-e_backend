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

/**
 * @swagger
 * components:
 *   schemas:
 *     Animal:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - breed
 *         - age
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Имя животного
 *         type:
 *           type: string
 *           description: Тип животного (например, кошка, собака)
 *         breed:
 *           type: string
 *           description: Порода животного
 *         age:
 *           type: number
 *           description: Возраст животного
 *         price:
 *           type: number
 *           description: Цена животного
 *         description:
 *           type: string
 *           description: Описание животного
 *         image:
 *           type: string
 *           format: binary
 *           description: Фотография животного
 */

router.use(authenticate);

/**
 * @swagger
 * /animals/user:
 *   get:
 *     tags: [Животные]
 *     summary: Получить список животных пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список животных пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Animal'
 *       401:
 *         description: Не авторизован
 */
router.get('/user', ctrlWrapper(getUserAnimals));

/**
 * @swagger
 * /animals:
 *   post:
 *     tags: [Животные]
 *     summary: Добавить новое животное
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Animal'
 *     responses:
 *       201:
 *         description: Животное успешно добавлено
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 */
router.post(
  '/',
  upload.single('image'),
  validateBody(animalAddSchema),
  ctrlWrapper(addAnimal)
);

/**
 * @swagger
 * /animals:
 *   get:
 *     tags: [Животные]
 *     summary: Получить список животных заводчика
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список животных заводчика
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Animal'
 *       401:
 *         description: Не авторизован
 */
router.get('/', ctrlWrapper(getBreederAnimals));

/**
 * @swagger
 * /animals/{animalId}:
 *   get:
 *     tags: [Животные]
 *     summary: Получить информацию о животном по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID животного
 *     responses:
 *       200:
 *         description: Информация о животном
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Animal'
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Животное не найдено
 */
router.get('/:animalId', isValidId('animalId'), ctrlWrapper(getAnimalById));

/**
 * @swagger
 * /animals/{animalId}:
 *   put:
 *     tags: [Животные]
 *     summary: Обновить информацию о животном
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID животного
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Animal'
 *     responses:
 *       200:
 *         description: Информация о животном обновлена
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Животное не найдено
 *   delete:
 *     tags: [Животные]
 *     summary: Удалить животное
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID животного
 *     responses:
 *       200:
 *         description: Животное успешно удалено
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Животное не найдено
 */
router.put(
  '/:animalId',
  isValidId('animalId'),
  upload.single('image'),
  validateBody(animalUpdateSchema),
  ctrlWrapper(updateAnimal)
);
router.delete('/:animalId', isValidId('animalId'), ctrlWrapper(deleteAnimal));

/**
 * @swagger
 * /animals/check-name:
 *   post:
 *     tags: [Животные]
 *     summary: Проверить доступность имени животного
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя для проверки
 *     responses:
 *       200:
 *         description: Имя доступно
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 *       409:
 *         description: Имя уже занято
 */
router.post(
  '/check-name',
  validateBody(checkAnimalNameSchema),
  ctrlWrapper(checkAnimalName)
);

export { router as animalsRouter };
