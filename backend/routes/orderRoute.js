import express from 'express';
import { addOrder, getSoldProducts, getBoughtProducts, getOrders, 
    deleteProduct, checkProduct, getSellOrders, verifyOtp, regenerateOtp, getOrderedItems } 
    from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/add', addOrder);
orderRouter.route('/deliver').get(getSellOrders);
orderRouter.route('/').get(getOrders);
orderRouter.route('/solditems').get(getSoldProducts);
orderRouter.route('/boughtitems').get(getBoughtProducts);
orderRouter.post('/delete', deleteProduct);
orderRouter.post('/check', checkProduct);
orderRouter.post('/verifyOtp', verifyOtp);
orderRouter.post('/regenerateOtp', regenerateOtp);
orderRouter.post('/getOrderedItems', getOrderedItems);

export default orderRouter;