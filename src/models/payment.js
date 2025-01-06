import { Schema, model } from 'mongoose';

const paymentSchema = new Schema(
  {
    animal: {
      type: Schema.Types.ObjectId,
      ref: 'Animal',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'UAH',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentProviderResponse: {
      type: Schema.Types.Mixed,
      required: false,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true }
);

const Payment = model('Payment', paymentSchema);

export default Payment;
