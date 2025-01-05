import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

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

export default {
  registerBreeder: ctrlWrapper(registerBreeder),
  registerRegularUser: ctrlWrapper(registerRegularUser),
  login: ctrlWrapper(login),
  refresh: ctrlWrapper(refresh),
  logout: ctrlWrapper(logout),
};
