import { updateUserStatus, getUserStatus } from '../services/online-status.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const updateStatus = async (req, res) => {
  const { isOnline } = req.body;
  const { _id: userId } = req.user;

  const updatedUser = await updateUserStatus(userId, isOnline);
  res.json({ user: updatedUser });
};

const getStatus = async (req, res) => {
  const { userId } = req.params;

  const status = await getUserStatus(userId);
  res.json(status);
};

export default {
  updateStatus: ctrlWrapper(updateStatus),
  getStatus: ctrlWrapper(getStatus),
};
