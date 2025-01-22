import express from 'express';
import {login, register, checkToken} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.post('/checkToken', checkToken);

export default userRouter;