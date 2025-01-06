import express from 'express';
import { authRouter } from './auth.js';
import { protectedRouter } from './protected.js';
import { onlineStatusRouter } from './online-status.js';
import { animalsRouter } from './animals.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use('/auth', authRouter);
router.use('/protected', protectedRouter);
router.use('/users', onlineStatusRouter);
router.use('/animals', animalsRouter);

export { router as mainRouter };
