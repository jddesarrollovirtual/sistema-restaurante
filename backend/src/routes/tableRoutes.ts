import { Router } from 'express';
import { tableController } from '../controllers/tableController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/', authMiddleware, tableController.getAll);
router.post('/', authMiddleware, roleMiddleware(['administrador']), tableController.create);
router.put('/:id', authMiddleware, roleMiddleware(['administrador']), tableController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['administrador']), tableController.delete);

export default router;
