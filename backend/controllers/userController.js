import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import authenticateToken from "../middleware/authMiddleware.js";

// create a token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// route for user login
const login = async (req, res) => {
    try{
        const { email, password } = req.body;
  
        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }
        // check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    
        // Generate token
        const token = createToken(user._id);
    
        // Set HttpOnly cookie
        res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure secure in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    
        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
  

// route for user registration
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, password } = req.body;
        // check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ firstName, lastName, email, contactNumber, password: hashedPassword });

        const user = await newUser.save();
        console.log(newUser);

        const token = createToken(user._id);
        // console.log(token);

        res.json({ success: true, token });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const checkToken = (req, res) => {
    // console.log(req)
    const token = req.body.token;
    // console.log(token);
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ success: true, userId: decoded.id });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

const details = async (req, res) => {
    console.log(req.body.email);
    const email = req.body.email;
    try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    const { email, firstName, lastName, contactNumber } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { firstName, lastName, contactNumber },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { login, register, checkToken, details, update };