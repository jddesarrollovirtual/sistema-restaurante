import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', authMiddleware, roleMiddleware(['administrador']), register);

export default router;
