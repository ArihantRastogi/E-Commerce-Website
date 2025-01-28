import express from 'express';
import { login, register, checkToken, details, update } from '../controllers/userController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.post('/checkToken', checkToken);
userRouter.post('/details', details);
userRouter.post('/update', authenticateToken, update);

export default userRouter;