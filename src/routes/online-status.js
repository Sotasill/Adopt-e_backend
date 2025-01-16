import express from 'express';
import { onlineStatus as onlineStatusController } from '../controllers/online-status.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

/**
 * @swagger
 * /online-status/status:
 *   patch:
 *     tags: [Онлайн статус]
 *     summary: Обновить онлайн статус пользователя
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [online, offline]
 *                 description: Новый статус пользователя
 *     responses:
 *       200:
 *         description: Статус успешно обновлен
 *       401:
 *         description: Не авторизован
 *       400:
 *         description: Неверный формат статуса
 */
router.patch('/status', authenticate, onlineStatusController.updateStatus);

/**
 * @swagger
 * /online-status/status/{userId}:
 *   get:
 *     tags: [Онлайн статус]
 *     summary: Получить онлайн статус пользователя
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Статус пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [online, offline]
 *                   description: Текущий статус пользователя
 *                 lastSeen:
 *                   type: string
 *                   format: date-time
 *                   description: Время последнего онлайна
 *       404:
 *         description: Пользователь не найден
 */
router.get('/status/:userId', onlineStatusController.getStatus);

export { router as onlineStatusRouter };
