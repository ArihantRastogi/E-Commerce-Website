import express from 'express';
import { getProductById, addProduct, getProducts } from '../controllers/productController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const productRouter = express.Router();

productRouter.get('/:id', getProductById);
productRouter.post('/add', authenticateToken, addProduct);
productRouter.route('/').get(getProducts);

export default productRouter;