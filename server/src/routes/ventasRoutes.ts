import { Router } from 'express';
import { createVenta,registrarDetallesVenta,updateDetalleVenta,deleteDetalleVenta,getVentas,deleteVenta,getDetallesVenta} from '../controllers/ventasControllers';

const router = Router();
router.get('/detalle-venta/lista/:id', getDetallesVenta);
router.get('/lista',getVentas);
router.post('/create', createVenta);
router.post('/detalle/create', registrarDetallesVenta);
router.put('/detalle-venta/:id_Detalle', updateDetalleVenta);
router.delete('/detalle-venta/:id_Detalle', deleteDetalleVenta);
router.delete('/ventad/:id_Venta', deleteVenta);



export default router;
