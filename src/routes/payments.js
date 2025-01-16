import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  initiatePayment,
  handlePaymentCallback,
  checkPaymentStatus,
} from '../controllers/payments.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import skipPayment from '../middleware/skipPayment.js';

const router = express.Router();

/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     tags: [Платежи]
 *     summary: Инициировать новый платеж
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animalId
 *             properties:
 *               animalId:
 *                 type: string
 *                 description: ID животного для покупки
 *     responses:
 *       200:
 *         description: Платеж успешно инициирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentUrl:
 *                   type: string
 *                   description: URL для перехода к оплате
 *                 paymentId:
 *                   type: string
 *                   description: ID платежа
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Животное не найдено
 */
router.post(
  '/initiate',
  authenticate,
  skipPayment,
  ctrlWrapper(initiatePayment)
);

/**
 * @swagger
 * /payments/callback/{paymentId}:
 *   post:
 *     tags: [Платежи]
 *     summary: Обработка callback от платежной системы
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID платежа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Статус платежа
 *     responses:
 *       200:
 *         description: Callback успешно обработан
 *       400:
 *         description: Неверные данные callback
 */
router.post(
  '/callback/:paymentId',
  skipPayment,
  ctrlWrapper(handlePaymentCallback)
);

/**
 * @swagger
 * /payments/status/{paymentId}:
 *   get:
 *     tags: [Платежи]
 *     summary: Проверить статус платежа
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID платежа
 *     responses:
 *       200:
 *         description: Статус платежа
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Текущий статус платежа
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Платеж не найден
 */
router.get(
  '/status/:paymentId',
  authenticate,
  skipPayment,
  ctrlWrapper(checkPaymentStatus)
);

export default router;
