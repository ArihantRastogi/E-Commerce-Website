import User from "../models/userModels.js";
import Order from "../models/orderModel.js";
import Review from "../models/reviewModel.js";
import asyncHandler from 'express-async-handler';

// Fetch reviews of user
const getReviews = asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    try {
        const user = await User.find({ userId });
        if(!user) {
            return res.status(404).json({ success: "false", message: 'User not found' });
        }
        const allReviews = await Review.find({ userId });
        res.json(allReviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Fetch review by orderId
const getReview = asyncHandler(async (req, res) => {
    // console.log(req.body);
    const orderId = req.body.orderId;
    try {
        const review = await Review.findOne({ orderId });
        if(!review) {
            return res.status(404).json({ success: "false", message: 'Review not found' });
        }
        res.json({success:true, review});
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

// Add review of user given orderId
const addReview = asyncHandler(async (req, res) => {
    // console.log(req.body);
    const { orderId, rating, comment } = req.body.reviewData;
    try {
        const order = await Order.findById(orderId);
        if(!order) {
            return res.status(404).json({ success: "false", message: 'Order not found' });
        }
        const userId = order.sellerId;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ success: "false", message: 'User not found' });
        }
        const existingReview = await Review.findOne({ orderId });
        if (existingReview) {
            return res.status(400).json({ success: "false", message: 'Review already exists for this order' });
        }
        const newReview = new Review({ userId, orderId, rating, comment });
        const review = await newReview.save();
        user.sellerReviews.push(review._id);
        await user.save();
        return res.json({ success:true, review});
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

// get seller rating 
const getSellerRating = asyncHandler(async (req, res) => {
    const sellerId = req.body.sellerId;
    try {
        const seller = await User.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ success: false, message: 'Seller not found' });
        }
        const allReviews = await Review.find({ userId: sellerId });
        let totalRating = 0;
        allReviews.forEach(review => {
            totalRating += review.rating;
        });
        const rating = totalRating / allReviews.length;
        res.json({ success: true, rating });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


export { getReviews, addReview, getReview, getSellerRating };