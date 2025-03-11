import express from 'express';
import { auth as authController } from '../controllers/auth.js';
import { validateBody } from '../middleware/index.js';
import {
  registerBreederSchema,
  registerUserSchema,
  registerSpecialistSchema,
  loginSchema,
  resetPasswordEmailSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../schemas/auth.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register/breeder:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Регистрация заводчика
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Заводчик успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: Пользователь с таким email уже существует
 */
router.post(
  '/register/breeder',
  validateBody(registerBreederSchema),
  authController.registerBreeder
);

/**
 * @swagger
 * /auth/register/user:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Регистрация обычного пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: Пользователь с таким email уже существует
 */
router.post(
  '/register/user',
  validateBody(registerUserSchema),
  authController.registerRegularUser
);

/**
 * @swagger
 * /auth/register/specialist:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Регистрация специалиста
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Специалист успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: Пользователь с таким email уже существует
 */
router.post(
  '/register/specialist',
  validateBody(registerSpecialistSchema),
  authController.registerSpecialist
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Вход в систему
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Неверные учетные данные
 */
router.post('/login', validateBody(loginSchema), authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Обновление токена доступа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Токен успешно обновлен
 *       401:
 *         description: Недействительный refresh token
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Выход из системы
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход
 *       401:
 *         description: Не авторизован
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @swagger
 * /auth/send-reset-email:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Отправка email для сброса пароля
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email для сброса пароля отправлен
 *       404:
 *         description: Пользователь не найден
 */
router.post(
  '/send-reset-email',
  validateBody(resetPasswordEmailSchema),
  authController.sendResetEmail
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Сброс пароля
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Пароль успешно изменен
 *       400:
 *         description: Недействительный токен или новый пароль
 */
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Подтверждение email адреса
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email успешно подтвержден
 *       400:
 *         description: Недействительный токен
 */
router.post(
  '/verify-email',
  validateBody(verifyEmailSchema),
  authController.verifyEmail
);

/**
 * @swagger
 * /auth/verify-email/resend:
 *   post:
 *     tags: [Аутентификация]
 *     summary: Отправка email для подтверждения адреса
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email для подтверждения отправлен
 *       401:
 *         description: Не авторизован
 */
router.post(
  '/verify-email/resend',
  authenticate,
  authController.sendVerificationEmail
);

export default router;
