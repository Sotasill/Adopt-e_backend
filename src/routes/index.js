import express from 'express';
import { authRouter } from './auth.js';
import { protectedRouter } from './protected.js';
import { onlineStatusRouter } from './online-status.js';
import { animalsRouter } from './animals.js';
import uploadRouter from './upload.js';
import galleryRouter from './gallery.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use('/auth', authRouter);
router.use('/protected', protectedRouter);
router.use('/users', onlineStatusRouter);
router.use('/animals', animalsRouter);
router.use('/upload', uploadRouter);
router.use('/animals/gallery', galleryRouter);

export { router as mainRouter };
