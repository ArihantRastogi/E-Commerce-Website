import Item from "../models/itemModel.js";
import User from "../models/userModels.js";
import Order from "../models/orderModel.js";
import asyncHandler from 'express-async-handler';
import bcrypt from "bcrypt";

// Fetch products sold by user
const getSoldProducts = asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ success: "false", message: 'User not found' });
        }
        const soldItems = user.soldItems;
        const products = await Promise.all(soldItems.map(async (item) => {
            const product = await Item.findById(item._id);
            return product;
        }));
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Fetch products bought by user
const getBoughtProducts = asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ success: "false", message: 'User not found' });
        }
        const boughtItems = user.boughtItems;
        const products = await Promise.all(boughtItems.map(async (item) => {
            const product = await Item.findById(item._id);
            return product;
        }));
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Fetch user orders
const getOrders = asyncHandler(async (req, res) => {
    // console.log(req.query)
    const userId = req.query.userId;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ success: "false", message: 'User not found' });
        }
        const orders = await Order.find({ buyerId: userId, transactionStatus: 'Pending' });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Fetch seller orders
const getSellOrders = asyncHandler(async (req, res) => {
    // console.log(req.query)
    const userId = req.query.userId;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ success: "false", message: 'User not found' });
        }
        const orders = await Order.find({ sellerId: userId, transactionStatus: 'Pending' });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add new order
const addOrder = asyncHandler(async (req, res) => {
    const { buyerEmail, sellerId, amount, otp, Items } = req.body;
    try {
        const buyer = await User.findOne({ email: buyerEmail });
        if(!buyer) {
            return res.status(404).json({ success: "false", message: 'Buyer not found' });
        }
        const seller = await User.findById(sellerId);
        if(!seller) {
            return res.status(404).json({ success: "false", message: 'Seller not found' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        const newOrder = new Order({  
            buyerId : buyer._id, 
            sellerId : seller._id, 
            buyerEmail,
            sellerEmail: seller.email,
            amount, 
            otp,
            hashedOtp,
            Items // Save the Items array in the order
        });
        const order = await newOrder.save();

        return res.json({ success:true, order});
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

// check if already in cart
const checkProduct = asyncHandler(async (req, res) => {
    const { userEmail, productId } = req.body;
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
        const product = await Item.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product does not exist" });
        }
        if (user.cartItems.includes(productId)) {
            return res.status(201).json({ success: false, message: "Product already in cart" });
        }
        res.status(201).json({ success: true, message: "Product not in cart" });
    } catch (error) {
        console.error('Error checking product in cart:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const { userEmail, productId } = req.body;
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
        const product = await Item.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product does not exist" });
        }
        if (!user.cartItems.includes(productId)) {
            return res.status(400).json({ success: false, message: "Product not in cart" });
        }
        user.cartItems = user.cartItems.filter(item => item.toString() !== productId);
        await user.save();
        res.status(200).json({ success: true, message: "Product removed from cart" });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// verify OTP and update the info (BoughtItems, SoldItems and transactionStatus)
const verifyOtp = asyncHandler(async (req, res) => {
    const { orderId, otp } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order does not exist" });
        }
        const isMatch = await bcrypt.compare(otp, order.hashedOtp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        order.transactionStatus = 'Completed';
        order.Items.forEach(async (item) => {
            // Add to buyer's boughtItems
            const buyer = await User.findById(order.buyerId);
            buyer.boughtItems.push(item);
            await buyer.save();
            // Add to seller's soldItems
            const seller = await User.findById(order.sellerId);
            seller.soldItems.push(item);
            await seller.save();
        });
        await order.save();
        res.status(200).json({ success: true, message: "Order completed successfully" });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// regenerate OTP
const regenerateOtp = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order does not exist" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
        order.otp = otp;
        order.hashedOtp = hashedOtp;
        await order.save();
        res.status(200).json({ success: true, message: "OTP regenerated successfully" });
    } catch (error) {
        console.error('Error regenerating OTP:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export { addOrder, getSoldProducts, getBoughtProducts, getOrders, getSellOrders, deleteProduct, checkProduct, verifyOtp, regenerateOtp };