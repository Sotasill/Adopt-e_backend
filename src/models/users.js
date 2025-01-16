import { model, Schema } from 'mongoose';
import { emailRegexp, nameRegexp } from '../constants/users.js';
import { uniqueUserIdMiddleware } from '../middleware/uniqueUserId.js';

// Функция для генерации уникального ID пользователя
const generateUserId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const usersSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      default: generateUserId,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      match: nameRegexp,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'breeder'],
      required: true,
      default: 'user',
    },
    // Поля для заводчика
    companyName: {
      type: String,
      required: function () {
        return this.role === 'breeder';
      },
    },
    address: {
      type: String,
      required: function () {
        return this.role === 'breeder';
      },
    },
    specialization: {
      type: String,
      enum: ['cat', 'dog'],
      required: function () {
        return this.role === 'breeder';
      },
    },
    country: {
      type: String,
      required: function () {
        return this.role === 'breeder';
      },
    },
    isOnline: {
      type: Boolean,
      default: false,
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
  {
    timestamps: true,
    versionKey: false,
  }
);

usersSchema.pre('save', uniqueUserIdMiddleware);

export const UsersCollection = model('User', usersSchema);
export const User = UsersCollection;
