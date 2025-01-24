import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    transactionStatus: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyerEmail: {
        type: String,
        required: true
    },
    sellerEmail: {
        type: String,
        ref: 'User',
        required: true
    },
    Items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: []
    }],
    amount: {
        type: Number,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    hashedOtp: {
        type: String,
        required: true
    }
}, {
    minimize: false,
    timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
