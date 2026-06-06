import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, productController.getAll);
router.post('/', authMiddleware, roleMiddleware(['administrador']), productController.create);
router.put('/:id', authMiddleware, roleMiddleware(['administrador']), productController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['administrador']), productController.delete);

export default router;
