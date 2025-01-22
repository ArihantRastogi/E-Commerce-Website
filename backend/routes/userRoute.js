import express from 'express';
import { login, register, checkToken, details, update } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.post('/checkToken', checkToken);
userRouter.post('/details', details);
userRouter.post('/update', update);

export default userRouter;