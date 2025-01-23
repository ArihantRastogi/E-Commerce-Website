import express from 'express';
import { getProductById, addProduct, getProducts, deleteProduct } from '../controllers/sellerController.js';

const sellerRouter = express.Router();

sellerRouter.get('/:id', getProductById);
sellerRouter.post('/add', addProduct);
sellerRouter.route('/').get(getProducts);
sellerRouter.post('/delete', deleteProduct);

export default sellerRouter;