import express from 'express';
import { getReviews, addReview, getReview } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.route('/').get(getReviews);
reviewRouter.post('/get', getReview);
reviewRouter.post('/add', addReview);

export default reviewRouter;