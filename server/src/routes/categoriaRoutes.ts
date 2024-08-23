import { Router } from 'express';
import { getCategorias,addCategoria,deleteCategoria,updateCategoria } from '../controllers/categoriaControllers';
const router = Router();

router.get('/', getCategorias);
router.post('/', addCategoria);
router.delete('/:idCategoria', deleteCategoria);
router.put('/:idCategoria', updateCategoria);

export default router;
