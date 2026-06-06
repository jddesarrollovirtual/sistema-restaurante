import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, orderController.getAll);
router.post('/', authMiddleware, orderController.create);
router.patch('/:id/status', authMiddleware, orderController.updateStatus);

export default router;
