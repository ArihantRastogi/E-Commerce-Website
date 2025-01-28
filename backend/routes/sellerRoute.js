import express from 'express';
import { getProductById, addProduct, getProducts, deleteProduct } from '../controllers/sellerController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const sellerRouter = express.Router();

sellerRouter.get('/:id', getProductById);
sellerRouter.post('/add', authenticateToken, addProduct);
sellerRouter.route('/').get(getProducts);
sellerRouter.post('/delete', authenticateToken, deleteProduct);

export default sellerRouter;