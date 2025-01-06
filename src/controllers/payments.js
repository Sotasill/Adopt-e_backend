import {
  createPayment,
  processPayment,
  getPaymentStatus,
} from '../services/payment.js';
import { HttpError } from '../utils/errorHandler.js';

export const initiatePayment = async (req, res) => {
  const { _id: userId } = req.user;
  const { animalId, amount, paymentMethod } = req.body;

  if (!animalId || !amount || !paymentMethod) {
    throw new HttpError(400, 'Missing required payment information');
  }

  const payment = await createPayment({
    animalId,
    userId,
    amount,
    paymentMethod,
  });

  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      payment,
    },
  });
};

export const handlePaymentCallback = async (req, res) => {
  const { paymentId } = req.params;
  const paymentProviderResponse = req.body;

  const payment = await processPayment(paymentId, paymentProviderResponse);

  res.json({
    status: 'success',
    code: 200,
    data: {
      payment,
    },
  });
};

export const checkPaymentStatus = async (req, res) => {
  const { paymentId } = req.params;

  const payment = await getPaymentStatus(paymentId);

  res.json({
    status: 'success',
    code: 200,
    data: {
      payment,
    },
  });
};
