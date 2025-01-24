import express from 'express';
import { addOrder, getSoldProducts, getBoughtProducts, getOrders, deleteProduct, checkProduct } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/add', addOrder);
orderRouter.route('/').get(getOrders);
orderRouter.route('/solditems').get(getSoldProducts);
orderRouter.route('/boughtitems').get(getBoughtProducts);
orderRouter.post('/delete', deleteProduct);
orderRouter.post('/check', checkProduct);

export default orderRouter;