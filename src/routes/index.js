import express from 'express';
import authRouter from './auth.js';
import protectedRouter from './protected.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use('/auth', authRouter);
router.use('/protected', protectedRouter);

export default router;
