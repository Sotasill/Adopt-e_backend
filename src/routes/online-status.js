import express from 'express';
import { onlineStatus as onlineStatusController } from '../controllers/online-status.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.patch('/status', authenticate, onlineStatusController.updateStatus);
router.get('/status/:userId', onlineStatusController.getStatus);

export { router as onlineStatusRouter };
