import express from 'express';
import { getAllUsers, login, signUp } from '../controllers/user.controller';
const router= express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/', getAllUsers);

export default router;