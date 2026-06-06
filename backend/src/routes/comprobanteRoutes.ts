import { Router } from 'express';
import { ComprobanteController } from '../controllers/comprobanteController.js';

const router = Router();

router.post('/', ComprobanteController.create);
router.get('/', ComprobanteController.getAll);

export default router;
