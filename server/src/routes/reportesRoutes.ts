import { Router } from 'express';
import { getReport } from '../controllers/reportesControllers';

const router = Router();

router.get('/',getReport);

export default router;
