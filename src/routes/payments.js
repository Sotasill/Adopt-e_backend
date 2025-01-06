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

// В режиме разработки используем skipPayment
router.post(
  '/initiate',
  authenticate,
  skipPayment,
  ctrlWrapper(initiatePayment)
);
router.post(
  '/callback/:paymentId',
  skipPayment,
  ctrlWrapper(handlePaymentCallback)
);
router.get(
  '/status/:paymentId',
  authenticate,
  skipPayment,
  ctrlWrapper(checkPaymentStatus)
);

export default router;
