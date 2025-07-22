import express from 'express';
import { register, login, getProfile, updateProfile, getAllUsers, updateUser, deleteUser, createUser } from '../controllers/UserController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

router.get('/', auth, getAllUsers)
router.put('/:id', auth, updateUser)
router.delete('/:id', auth, deleteUser)

router.post("/new", auth, createUser);

export default router;
