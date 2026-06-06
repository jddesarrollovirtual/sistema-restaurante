import { Router } from 'express';
import { getWaiters, getAllUsers } from '../controllers/userController';

const router = Router();

router.get('/waiters', getWaiters);
router.get('/all', getAllUsers);

export default router;
