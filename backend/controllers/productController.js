import Item from "../models/itemModel.js";
import User from "../models/userModels.js";
import asyncHandler from 'express-async-handler';

// Fetch products that the user is not an owner of
const getProducts = asyncHandler(async (req, res) => {
    const userId = req.query.userId; // Get userId from query parameters
    try {
        const products = await Item.find({ sellerId: { $ne: userId } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

const getProductById = asyncHandler(async (req, res) => {
    console.log(req);
    const product = await Item.findById(req.params.id);
    if (product) {
        const seller = await User.findById(product.sellerId);
        if (seller) {
            res.json({
                _id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                sellerId: product.sellerId,
                userEmail: seller.email
            });
        } else {
            res.status(404);
            throw new Error('Seller not found');
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// Add new product
const addProduct = asyncHandler(async (req, res) => {
    const { name, price, description, category, sellerId } = req.body;
    console.log(req.body);
    const _id = req.body.sellerId;
    // check if user exists
    const user = await User.findOne({ _id });
    if (!user) {
        return res.json({ success: false, message: "User does not exist" });
    }
    const product = new Item({
        name,
        price,
        description,
        category,
        sellerId,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

export { getProductById, addProduct, getProducts };