import express from 'express';
import authController from '../controllers/auth.js';
import { validateBody } from '../middleware/index.js';
import { registerSchema, loginSchema } from '../schemas/auth.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

export default router;
