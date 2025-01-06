import Animal from '../models/animal.js';

const skipPayment = async (req, res, next) => {
  try {
    // Если в запросе есть ID животного, автоматически помечаем его как оплаченное
    if (req.body.animalId) {
      const animal = await Animal.findById(req.body.animalId);
      if (animal) {
        animal.paymentStatus = 'completed';
        animal.isPaid = true;
        await animal.save();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default skipPayment;
