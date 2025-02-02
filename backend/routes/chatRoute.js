import express from 'express';
import { sendMessage } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.post('/sendMessage', sendMessage);

export default chatRouter;