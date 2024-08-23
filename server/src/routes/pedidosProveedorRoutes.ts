import { Router } from 'express';
import { 
  registrarPedido, 
  obtenerPedidos, 
  obtenerPedidoPorId, 
  eliminarPedido, 
  registrarDetallesPedido, 
  obtenerDetallesPedido 
} from '../controllers/pedidoProveedorControllers'; // Ajusta la ruta de importación según sea necesario

const router = Router();
// Rutas para pedidos
router.post('/', registrarPedido);
router.get('/', obtenerPedidos);
router.get('/:idPedido', obtenerPedidoPorId); // Simplifica la ruta
router.delete('/:idPedido', eliminarPedido); // Simplifica la ruta

// Rutas para detalles de pedidos
router.post('/detalles-pedido', registrarDetallesPedido);
router.get('/detalles-pedido/:idPedido', obtenerDetallesPedido);

export default router;

