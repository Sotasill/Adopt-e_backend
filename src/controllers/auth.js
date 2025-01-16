import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetPasswordEmail,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from '../services/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const registerBreeder = async (req, res) => {
  const userData = await registerUser({ ...req.body, role: 'breeder' });
  res.status(201).json({ user: userData });
};

const registerRegularUser = async (req, res) => {
  const userData = await registerUser({ ...req.body, role: 'user' });
  res.status(201).json({ user: userData });
};

const login = async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await refreshSession(refreshToken);
  res.json(tokens);
};

const logout = async (req, res) => {
  await logoutUser(req.user._id);
  res.status(204).send();
};

const sendResetEmail = async (req, res) => {
  const result = await sendResetPasswordEmail(req.body.email);
  res.json(result);
};

const resetPasswordHandler = async (req, res) => {
  const result = await resetPassword(req.body);
  res.json(result);
};

const sendVerificationEmailHandler = async (req, res) => {
  const result = await sendVerificationEmail(req.user._id);
  res.json(result);
};

const verifyEmailHandler = async (req, res) => {
  const result = await verifyEmail(req.body.token);
  res.json(result);
};

export const auth = {
  registerBreeder: ctrlWrapper(registerBreeder),
  registerRegularUser: ctrlWrapper(registerRegularUser),
  login: ctrlWrapper(login),
  refresh: ctrlWrapper(refresh),
  logout: ctrlWrapper(logout),
  sendResetEmail: ctrlWrapper(sendResetEmail),
  resetPassword: ctrlWrapper(resetPasswordHandler),
  sendVerificationEmail: ctrlWrapper(sendVerificationEmailHandler),
  verifyEmail: ctrlWrapper(verifyEmailHandler),
};
