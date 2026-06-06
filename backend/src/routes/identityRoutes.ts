import { Router } from 'express';
import { IdentityController } from '../controllers/identityController';

const router = Router();

router.get('/dni/:dni', IdentityController.consultaDni);
router.get('/ruc/:ruc', IdentityController.consultaRuc);

export default router;
