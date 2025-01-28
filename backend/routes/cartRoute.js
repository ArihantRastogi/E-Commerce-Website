import express from 'express';
import { addProduct, getProducts, deleteProduct, checkProduct, updateStatus } from '../controllers/cartController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

cartRouter.post('/add', authenticateToken, addProduct);
cartRouter.route('/').get(getProducts);
cartRouter.post('/delete', authenticateToken, deleteProduct);
cartRouter.post('/check', authenticateToken, checkProduct);
cartRouter.post('/update', authenticateToken, updateStatus);

export default cartRouter;