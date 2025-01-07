import { Schema, model } from 'mongoose';
import {
  ANIMAL_ID_PREFIX,
  ANIMAL_ID_LENGTH,
  DEFAULT_IMAGES,
} from '../constants/animals.js';

const generateUniqueIdentifier = function () {
  const type = this.type;
  const prefix = ANIMAL_ID_PREFIX[type];
  const randomPart = Math.floor(Math.random() * Math.pow(10, ANIMAL_ID_LENGTH))
    .toString()
    .padStart(ANIMAL_ID_LENGTH, '0');
  return `${prefix}-${randomPart}`;
};

const animalSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['cat', 'dog'],
      required: true,
    },
    uniqueIdentifier: {
      type: String,
      unique: true,
      default: generateUniqueIdentifier,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mother: {
      type: Schema.Types.ObjectId,
      ref: 'Animal',
      required: false,
    },
    father: {
      type: Schema.Types.ObjectId,
      ref: 'Animal',
      required: false,
    },
    motherRegistered: {
      type: Boolean,
      default: false,
    },
    fatherRegistered: {
      type: Boolean,
      default: false,
    },
    breeder: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    litterRegistrationNumber: {
      type: String,
      required: false,
    },
    isRegisteredInSystem: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    microchip: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    furColor: {
      type: String,
      required: false,
    },
    eyeColor: {
      type: String,
      required: true,
    },
    furLength: {
      type: String,
      required: false,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    image: {
      url: {
        type: String,
        default: function () {
          return DEFAULT_IMAGES[this.type] || DEFAULT_IMAGES.cat;
        },
      },
      publicId: String, // для Cloudinary
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentId: {
      type: String,
      required: false,
    },
    registrationPrice: {
      type: Number,
      required: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      required: false,
      default: '',
    },
  },
  { versionKey: false, timestamps: true }
);

// Middleware для установки типа животного на основе специализации заводчика
animalSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const User = model('User');
      const breeder = await User.findById(this.breeder);
      // Устанавливаем тип только для заводчиков и только если breeder существует
      if (breeder && breeder.role === 'breeder' && !this.type) {
        this.type = breeder.specialization;
      }
      // Устанавливаем дефолтное изображение в зависимости от типа
      if (!this.image?.url) {
        this.image = { url: DEFAULT_IMAGES[this.type] };
      }
    } catch (error) {
      next(error);
    }
  }
  next();
});

const Animal = model('Animal', animalSchema);

export default Animal;
