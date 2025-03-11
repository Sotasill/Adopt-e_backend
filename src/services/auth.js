import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/users.js';
import getEnvVars from '../utils/getEnvVars.js';
import { SMTP } from '../constants/smtp.js';
import {
  generateVerificationEmail,
  generateResetPasswordEmail,
} from '../utils/emailTemplates.js';

const JWT_ACCESS_SECRET = getEnvVars('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = getEnvVars('JWT_REFRESH_SECRET');
const JWT_SECRET = getEnvVars('JWT_SECRET');
const APP_DOMAIN = getEnvVars('APP_DOMAIN');

const registerUser = async ({
  username,
  email,
  password,
  acceptTerms,
  role,
  specialization,
  companyName,
  country,
  city,
}) => {
  if (!acceptTerms) {
    throw createHttpError(
      400,
      'You must accept the terms and conditions to register'
    );
  }

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
    acceptTerms,
    role,
    specialization,
    companyName,
    country,
    city,
  });

  await sendVerificationEmail(newUser._id);

  const userData = newUser.toObject();
  delete userData.password;

  return { user: userData };
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

const sendResetPasswordEmail = async email => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${APP_DOMAIN}/reset-password?token=${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: getEnvVars(SMTP.SMTP_HOST),
    port: parseInt(getEnvVars(SMTP.SMTP_PORT)),
    secure: false,
    auth: {
      user: getEnvVars(SMTP.SMTP_USER),
      pass: getEnvVars(SMTP.SMTP_PASSWORD),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const htmlContent = await generateResetPasswordEmail(
      user.username,
      resetLink
    );

    await transporter.sendMail({
      from: getEnvVars(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset Your Password',
      html: htmlContent,
    });

    return {
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    };
  } catch (error) {
    console.error('Email sending error:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.'
    );
  }
};

const resetPassword = async ({ token, password }) => {
  try {
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return {
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    };
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(400, 'Invalid or expired reset token.');
    }
    throw error;
  }
};

const sendVerificationEmail = async userId => {
  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  if (user.verified) {
    throw createHttpError(400, 'Email already verified!');
  }

  const verificationToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: '24h',
  });

  user.verificationToken = verificationToken;
  await user.save();

  const verificationLink = `${APP_DOMAIN}/verify-email?token=${verificationToken}`;

  const transporter = nodemailer.createTransport({
    host: getEnvVars(SMTP.SMTP_HOST),
    port: parseInt(getEnvVars(SMTP.SMTP_PORT)),
    secure: false,
    auth: {
      user: getEnvVars(SMTP.SMTP_USER),
      pass: getEnvVars(SMTP.SMTP_PASSWORD),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const htmlContent = await generateVerificationEmail(
      user.username,
      verificationLink
    );

    await transporter.sendMail({
      from: getEnvVars(SMTP.SMTP_FROM),
      to: user.email,
      subject: 'Verify Your Email',
      html: htmlContent,
    });

    return {
      status: 200,
      message: 'Verification email has been sent.',
      data: {},
    };
  } catch (error) {
    console.error('Email sending error:', error);
    throw createHttpError(500, 'Failed to send verification email.');
  }
};

const verifyEmail = async token => {
  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(userId);

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    if (user.verified) {
      throw createHttpError(400, 'Email already verified!');
    }

    if (user.verificationToken !== token) {
      throw createHttpError(400, 'Invalid verification token!');
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    return {
      status: 200,
      message: 'Email successfully verified!',
      data: {},
    };
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(400, 'Invalid or expired verification token.');
    }
    throw error;
  }
};

export {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetPasswordEmail,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
