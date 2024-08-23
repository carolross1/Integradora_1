import { Router } from 'express';
import { 
  getProveedores, 
  addProveedor, 
  deleteProveedor, 
  updateProveedor 
} from '../controllers/proveedores-listControllers';

const router = Router();

// Ruta para obtener todos los proveedores
router.get('/', getProveedores);

// Ruta para agregar un nuevo proveedor
router.post('/', addProveedor);

// Ruta para eliminar un proveedor por ID
router.delete('/:idProveedor', deleteProveedor);

// Ruta para actualizar un proveedor por ID
router.put('/:idProveedor', updateProveedor);

export default router;
