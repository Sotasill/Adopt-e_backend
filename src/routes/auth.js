import express from 'express';
import { auth as authController } from '../controllers/auth.js';
import { validateBody } from '../middleware/index.js';
import {
  registerBreederSchema,
  registerUserSchema,
  loginSchema,
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

export { router as authRouter };
