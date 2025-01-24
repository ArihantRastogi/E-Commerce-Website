import express from 'express';
import { addProduct, getProducts, deleteProduct, checkProduct } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post('/add', addProduct);
cartRouter.route('/').get(getProducts);
cartRouter.post('/delete', deleteProduct);
cartRouter.post('/check', checkProduct);

export default cartRouter;