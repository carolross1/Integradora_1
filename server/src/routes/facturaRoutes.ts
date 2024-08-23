import { Router } from 'express';
import { getFacturas,createFactura,updateFactura,deleteFactura,obtenerDetallesVenta,obtenerTotalVenta,getFacturaU} from '../controllers/facturaControllers';
const router = Router();

router.get('/', getFacturas);  
router.get('/:id', getFacturaU);  
router.post('/', createFactura);
router.put('/:id', updateFactura);
router.delete('/:id', deleteFactura);
router.get('/detalles/:id_Venta', obtenerDetallesVenta);
router.get('/total/:id_Venta', obtenerTotalVenta);

export default router;
