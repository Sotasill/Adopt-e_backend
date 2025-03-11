import mongoose from 'mongoose';
import { nameRegexp, emailRegexp } from '../constants/users.js';
import { generateUserId, generateSpecialistId } from '../utils/generateId.js';
import {
  ROLES,
  ANIMAL_TYPES,
  SPECIALIST_TYPES,
  VALIDATION_PATTERNS,
} from '../constants/common.js';

const { Schema } = mongoose;

const usersSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      default: function () {
        return this.role === ROLES.SPECIALIST
          ? generateSpecialistId()
          : generateUserId();
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      match: [
        VALIDATION_PATTERNS.USERNAME,
        'Username must start with capital letter and contain only letters, numbers, underscore and dash',
      ],
      validate: {
        validator: function (v) {
          return VALIDATION_PATTERNS.NO_PROFANITY.test(v);
        },
        message: 'Username contains inappropriate language',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [VALIDATION_PATTERNS.EMAIL, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: function () {
        // Пароль обязателен только если нет социальной аутентификации
        return !this.googleId && !this.facebookId && !this.appleId;
      },
    },
    acceptTerms: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      default: ROLES.USER,
    },
    // Поля для социальной аутентификации
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    facebookId: {
      type: String,
      sparse: true,
      unique: true,
    },
    appleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    socialProvider: {
      type: String,
      enum: ['google', 'facebook', 'apple', null],
      default: null,
    },
    // Поля для заводчика
    companyName: {
      type: String,
      required: function () {
        return this.role === ROLES.BREEDER;
      },
      match: [
        VALIDATION_PATTERNS.COMPANY_NAME,
        'Company name must start with capital letter',
      ],
      validate: {
        validator: function (v) {
          return VALIDATION_PATTERNS.NO_PROFANITY.test(v);
        },
        message: 'Company name contains inappropriate language',
      },
    },
    country: {
      type: String,
      required: function () {
        return this.role === ROLES.BREEDER || this.role === ROLES.SPECIALIST;
      },
      match: [
        VALIDATION_PATTERNS.COUNTRY,
        'Country must start with capital letter',
      ],
    },
    city: {
      type: String,
      match: [VALIDATION_PATTERNS.CITY, 'City must start with capital letter'],
    },
    specialization: {
      type: String,
      required: function () {
        return this.role === ROLES.BREEDER || this.role === ROLES.SPECIALIST;
      },
      validate: {
        validator: function (v) {
          if (this.role === ROLES.BREEDER) {
            return Object.values(ANIMAL_TYPES).includes(v);
          } else if (this.role === ROLES.SPECIALIST) {
            return Object.values(SPECIALIST_TYPES).includes(v);
          }
          return true;
        },
        message: 'Invalid specialization for user role',
      },
    },
    // Общие поля
    isOnline: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    token: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },
    background: {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },
  },
  { versionKey: false, timestamps: true }
);

// Уникальный индекс для предотвращения дублирования email между разными ролями
usersSchema.index({ email: 1, role: 1 }, { unique: true });
// Уникальный индекс для предотвращения дублирования названия компании между разными ролями
usersSchema.index({ companyName: 1, role: 1 }, { unique: true, sparse: true });

const User = mongoose.model('User', usersSchema);

export { User };
