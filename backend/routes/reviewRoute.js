import express from 'express';
import { getReviews, addReview, getReview, getSellerRating } from '../controllers/reviewController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const reviewRouter = express.Router();

reviewRouter.route('/').get(getReviews);
reviewRouter.post('/get', authenticateToken, getReview);
reviewRouter.post('/add', authenticateToken, addReview);
reviewRouter.post('/rating', authenticateToken, getSellerRating);

export default reviewRouter;