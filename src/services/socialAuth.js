import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';
import getEnvVars from '../utils/getEnvVars.js';
import { ROLES } from '../constants/common.js';

const JWT_ACCESS_SECRET = getEnvVars('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = getEnvVars('JWT_REFRESH_SECRET');

const generateTokens = userId => {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
  return { accessToken, refreshToken };
};

export const socialAuth = async ({
  email,
  name,
  providerId,
  provider,
  acceptTerms,
}) => {
  try {
    if (!acceptTerms) {
      throw createHttpError(
        400,
        'You must accept the terms and conditions to register'
      );
    }

    let user = await User.findOne({
      $or: [{ email }, { [`${provider}Id`]: providerId }],
    });

    if (user) {
      // Если пользователь уже существует, обновляем его данные
      if (!user[`${provider}Id`]) {
        user[`${provider}Id`] = providerId;
        user.socialProvider = provider;
        await user.save();
      }
    } else {
      // Создаем нового пользователя
      const username = `${name.replace(/\s+/g, '')}${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      user = await User.create({
        email,
        username,
        [`${provider}Id`]: providerId,
        socialProvider: provider,
        role: ROLES.USER,
        acceptTerms,
        verified: true, // Для социальной аутентификации сразу верифицируем email
      });
    }

    const tokens = generateTokens(user._id);
    user.token = tokens.refreshToken;
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    return {
      user: userData,
      tokens,
    };
  } catch (error) {
    if (error.status === 400) {
      throw error;
    }
    throw createHttpError(500, 'Error during social authentication');
  }
};
