import { Router } from 'express';
import {iniciarCorte,cerrarCorte,obtenerCorteActual,obtenerCorteAbierto} from '../controllers/cortecajaControllers';

const router = Router();


router.post('/iniciar-corte', iniciarCorte);
router.post('/cerrar-corte', cerrarCorte);
router.get('/corte-actual', obtenerCorteActual);
router.get('/corte-abierto/:id_Usuario', obtenerCorteAbierto);

export default router;