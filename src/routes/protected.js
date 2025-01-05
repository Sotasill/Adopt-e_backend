import express from 'express';
import { auth } from '../middleware/index.js';
import { User } from '../models/users.js';

const router = express.Router();

// Получить всех пользователей (только для разработки)
router.get('/users', auth, async (req, res) => {
  const users = await User.find({}, '-password'); // исключаем пароль из результата
  res.json({ users });
});

// Защищенный маршрут
router.get('/profile', auth, (req, res) => {
  res.json({
    user: {
      email: req.user.email,
      username: req.user.username,
      userId: req.user.userId,
    },
  });
});

export default router;
