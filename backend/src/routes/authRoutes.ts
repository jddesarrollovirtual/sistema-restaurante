import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/login', login);
router.post('/register', authMiddleware, roleMiddleware(['administrador']), register);

export default router;
