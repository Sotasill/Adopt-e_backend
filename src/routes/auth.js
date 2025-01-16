import express from 'express';
import { auth as authController } from '../controllers/auth.js';
import { validateBody } from '../middleware/index.js';
import {
  registerBreederSchema,
  registerUserSchema,
  loginSchema,
  resetPasswordEmailSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../schemas/auth.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post(
  '/register/breeder',
  validateBody(registerBreederSchema),
  authController.registerBreeder
);
router.post(
  '/register/user',
  validateBody(registerUserSchema),
  authController.registerRegularUser
);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post(
  '/send-reset-email',
  validateBody(resetPasswordEmailSchema),
  authController.sendResetEmail
);
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  authController.resetPassword
);
router.post(
  '/verify-email',
  validateBody(verifyEmailSchema),
  authController.verifyEmail
);
router.post(
  '/send-verification-email',
  authenticate,
  authController.sendVerificationEmail
);

export { router as authRouter };
