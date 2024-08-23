// routes/inventarioRoutes.ts
import { Router } from 'express';
import { createInventario,getInventarios,closeInventario,guardarDetallesInventario } from '../controllers/inventarioControllers';
const router = Router();

router.post('/', createInventario);
router.get('/', getInventarios);
router.put('/close/:idInventario', closeInventario);
router.put('/detalle', guardarDetallesInventario);

export default router;
