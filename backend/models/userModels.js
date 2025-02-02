import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?iiit\.ac\.in$/, 'Please fill a valid IIIT email address']
    },
    contactNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: []
    }],
    boughtItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: []
    }],
    soldItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: []
    }],
    sellerReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        default: []
    }]
}, {
    minimize: false,
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
