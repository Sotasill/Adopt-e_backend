import Payment from '../models/payment.js';
import Animal from '../models/animal.js';
import { HttpError } from '../utils/errorHandler.js';

export const createPayment = async ({
  animalId,
  userId,
  amount,
  paymentMethod,
}) => {
  const payment = await Payment.create({
    animal: animalId,
    user: userId,
    amount,
    paymentMethod,
  });

  return payment;
};

export const processPayment = async (paymentId, paymentProviderResponse) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new HttpError(404, 'Payment not found');
  }

  payment.paymentProviderResponse = paymentProviderResponse;
  payment.status = paymentProviderResponse.success ? 'completed' : 'failed';
  await payment.save();

  if (payment.status === 'completed') {
    const animal = await Animal.findById(payment.animal);
    if (animal) {
      animal.paymentStatus = 'completed';
      animal.isPaid = true;
      await animal.save();
    }
  }

  return payment;
};

export const getPaymentStatus = async paymentId => {
  const payment = await Payment.findById(paymentId)
    .populate('animal')
    .populate('user');

  if (!payment) {
    throw new HttpError(404, 'Payment not found');
  }

  return payment;
};
