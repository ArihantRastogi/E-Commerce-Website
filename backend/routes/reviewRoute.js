import express from 'express';
import { getReviews, addReview, getReview, getSellerRating } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.route('/').get(getReviews);
reviewRouter.post('/get', getReview);
reviewRouter.post('/add', addReview);
reviewRouter.post('/rating', getSellerRating);

export default reviewRouter;