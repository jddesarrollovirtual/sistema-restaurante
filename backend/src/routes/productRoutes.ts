import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/', authMiddleware, productController.getAll);
router.post('/', authMiddleware, roleMiddleware(['administrador']), productController.create);
router.put('/:id', authMiddleware, roleMiddleware(['administrador']), productController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['administrador']), productController.delete);

export default router;
