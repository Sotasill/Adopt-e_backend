import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';
import getEnvVars from '../utils/getEnvVars.js';

const JWT_ACCESS_SECRET = getEnvVars('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = getEnvVars('JWT_REFRESH_SECRET');

const registerUser = async ({ username, email, password, phone }) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw createHttpError(
      409,
      existingUser.email === email
        ? 'Email already in use'
        : 'Username already in use'
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    phone,
  });

  const userData = newUser.toObject();
  delete userData.password;

  return userData;
};

const loginUser = async ({ username, password }) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw createHttpError(401, 'Username or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Username or password is wrong');
  }

  const accessToken = jwt.sign({ id: user._id }, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  user.token = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      username: user.username,
      userId: user.userId,
    },
  };
};

const refreshSession = async refreshToken => {
  try {
    const { id } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(id);

    if (!user || user.token !== refreshToken) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    const accessToken = jwt.sign({ id: user._id }, JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });

    const newRefreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    user.token = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Invalid refresh token');
    }
    throw error;
  }
};

const logoutUser = async userId => {
  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  user.token = null;
  await user.save();
};

export { registerUser, loginUser, refreshSession, logoutUser };
