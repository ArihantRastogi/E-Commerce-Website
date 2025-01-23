import express from 'express';
import { getProductById, addProduct, getProducts } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/:id', getProductById);
productRouter.post('/add', addProduct);
productRouter.route('/').get(getProducts);

export default productRouter;