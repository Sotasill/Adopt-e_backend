import { model, Schema } from 'mongoose';
import { emailRegexp, nameRegexp, phoneRegexp } from '../constants/users.js';
import uniqueUserIdMiddleware from '../middleware/uniqueUserId.js';

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
    phone: {
      type: String,
      required: true,
      match: phoneRegexp,
    },
    token: {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

usersSchema.pre('save', uniqueUserIdMiddleware);

export const UsersCollection = model('User', usersSchema);
export const User = UsersCollection;
