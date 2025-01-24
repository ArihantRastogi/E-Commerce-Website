import Item from "../models/itemModel.js";
import User from "../models/userModels.js";
import asyncHandler from 'express-async-handler';

// Fetch products from the user cart
const getProducts = asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ success: "false", message: 'User not found' });;
        }
        const cartItems = user.cartItems;
        const products = await Promise.all(cartItems.map(async (item) => {
            const product = await Item.findById(item._id);
            return product;
        }));
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add new product
const addProduct = asyncHandler(async (req, res) => {
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
            return res.status(400).json({ success: false, message: "Product already in cart" });
        }

        user.cartItems.push(productId);
        await user.save();

        res.status(201).json({ success: true, message: "Product added to cart" });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
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

export { addProduct, getProducts, deleteProduct, checkProduct };