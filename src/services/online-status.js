import { User } from '../models/users.js';

export const updateUserStatus = async (userId, isOnline) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      isOnline,
      lastActive: new Date(),
    },
    { new: true }
  ).select('-password');

  return updatedUser;
};

export const getUserStatus = async userId => {
  const user = await User.findById(userId).select('isOnline lastActive');
  return user;
};
