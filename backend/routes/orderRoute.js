import express from 'express';
import { addOrder, getSoldProducts, getBoughtProducts, getOrders, 
    deleteProduct, checkProduct, getSellOrders, verifyOtp, regenerateOtp, getOrderedItems } 
    from '../controllers/orderController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

orderRouter.post('/add', authenticateToken, addOrder);
orderRouter.route('/deliver').get(getSellOrders);
orderRouter.route('/').get(getOrders);
orderRouter.route('/solditems').get(getSoldProducts);
orderRouter.route('/boughtitems').get(getBoughtProducts);
orderRouter.post('/delete', authenticateToken, deleteProduct);
orderRouter.post('/check', authenticateToken, checkProduct);
orderRouter.post('/verifyOtp', authenticateToken, verifyOtp);
orderRouter.post('/regenerateOtp', authenticateToken, regenerateOtp);
orderRouter.post('/getOrderedItems', authenticateToken, getOrderedItems);

export default orderRouter;