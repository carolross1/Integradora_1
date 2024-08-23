import { Router } from 'express';
import { login } from '../controllers/loginControllers';

const router = Router();

router.post('/', login);

export default router;
