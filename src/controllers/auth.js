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
import { ROLES } from '../constants/common.js';

const registerRegularUser = async (req, res) => {
  const result = await registerUser({ ...req.body, role: ROLES.USER });
  res.status(201).json(result);
};

const registerBreeder = async (req, res) => {
  const result = await registerUser({ ...req.body, role: ROLES.BREEDER });
  res.status(201).json(result);
};

const registerSpecialist = async (req, res) => {
  const result = await registerUser({ ...req.body, role: ROLES.SPECIALIST });
  res.status(201).json(result);
};

const login = async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
};

const refresh = async (req, res) => {
  const result = await refreshSession(req.body.refreshToken);
  res.json(result);
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
  registerRegularUser: ctrlWrapper(registerRegularUser),
  registerBreeder: ctrlWrapper(registerBreeder),
  registerSpecialist: ctrlWrapper(registerSpecialist),
  login: ctrlWrapper(login),
  refresh: ctrlWrapper(refresh),
  logout: ctrlWrapper(logout),
  sendResetEmail: ctrlWrapper(sendResetEmail),
  resetPassword: ctrlWrapper(resetPasswordHandler),
  sendVerificationEmail: ctrlWrapper(sendVerificationEmailHandler),
  verifyEmail: ctrlWrapper(verifyEmailHandler),
};
