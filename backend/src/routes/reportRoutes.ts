import { Router } from 'express';
import * as reportController from '../controllers/reportController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/close', authMiddleware, reportController.closeDay);
router.get('/', authMiddleware, reportController.getReports);

export default router;
