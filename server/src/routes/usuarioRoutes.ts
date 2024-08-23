import { Router } from 'express';
import { createUser,getUser,getUsers,updateUser,deleteUser} from '../controllers/usuarioControllers';

const router = Router();

router.post('/create', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id_Usuario', updateUser);
router.delete('/:id', deleteUser);

export default router;