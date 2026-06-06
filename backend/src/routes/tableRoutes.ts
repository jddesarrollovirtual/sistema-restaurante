import { Router } from 'express';
import { tableController } from '../controllers/tableController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, tableController.getAll);
router.post('/', authMiddleware, roleMiddleware(['administrador']), tableController.create);
router.put('/:id', authMiddleware, roleMiddleware(['administrador']), tableController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['administrador']), tableController.delete);

export default router;
