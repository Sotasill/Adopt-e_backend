import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  avatarUpload,
  backgroundUpload,
  animalUpload,
} from '../utils/cloudinary.js';
import {
  updateUserAvatar,
  updateUserBackground,
  updateAnimalImage,
} from '../controllers/upload.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.patch(
  '/avatar',
  authenticate,
  avatarUpload.single('avatar'),
  ctrlWrapper(updateUserAvatar)
);

router.patch(
  '/background',
  authenticate,
  backgroundUpload.single('background'),
  ctrlWrapper(updateUserBackground)
);

router.patch(
  '/animal/:animalId',
  authenticate,
  animalUpload.single('image'),
  ctrlWrapper(updateAnimalImage)
);

export default router;
