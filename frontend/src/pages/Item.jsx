import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Navigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

// Category SVG Icons
const CategoryIcons = {
  Books: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  Clothing: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
    </svg>
  ),
  Electronics: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  Furniture: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  Grocery: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  ),
  Other: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )
};

const Item = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(Cookies.get('userEmail') || '');
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/product/${id}`);
                setItem(data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching item');
                setLoading(false);
            }
        };

        const checkToken = async () => {
            const token = Cookies.get('token');
            if (!token) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }
            try {
                const response = await axios.post('http://localhost:4000/api/user/checkToken', { token });
                if (response.data.success) {
                    setIsLoggedIn(true);
                    setUserEmail(Cookies.get('userEmail'));
                    fetchItem();
                } else {
                    Cookies.remove('token');
                    Cookies.remove('userEmail');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error checking token:', error);
                Cookies.remove('token');
                Cookies.remove('userEmail');
                setLoading(false);
            }
        };

        const checkIfInCart = async () => {
            try {
                const userEmail = Cookies.get('userEmail');
                if (userEmail) {
                    const response = await axios.post('http://localhost:4000/api/cart/check', {
                        userEmail: userEmail,
                        productId: id
                    });
                    if (response.data.success) {
                        setIsInCart(false);
                    } else {
                        setIsInCart(true);
                    }
                }
            } catch (error) {
                console.error('Error checking if item is in cart:', error);
            }
        };

        checkToken();
        checkIfInCart();
    }, [id]);

    const handleAddToCart = async (ID) => {
        try {
            const userEmail = Cookies.get('userEmail');
            if (!userEmail) {
                alert('Please log in to add items to cart');
                return;
            }
            await axios.post('http://localhost:4000/api/cart/add', {
                userEmail: userEmail,
                productId: ID
            });
            setIsInCart(true);
            window.location.reload();
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-xl text-gray-600">Loading...</div>
        </div>
    );
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-lg p-8">
                {/* Left Side - Item Details */}
                <div className="w-full md:w-2/3 pr-0 md:pr-8">
                    <h1 className="text-4xl font-bold mb-4 text-gray-800">{item.name}</h1>
                    <div className="space-y-4 text-gray-700">
                        <p className="text-xl"><strong>Description:</strong> {item.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-lg">
                                <strong>Price:</strong> 
                                <span className="text-green-600 font-bold ml-2">
                                    ₹{item.price.toFixed(2)}
                                </span>
                            </p>
                            <p className="text-lg">
                                <strong>Category:</strong> {item.category}
                            </p>
                            <p className="text-lg">
                                <strong>Seller:</strong> {item.userEmail}
                            </p>
                        </div>
                        <button
                            onClick={() => handleAddToCart(item._id)}
                            disabled={userEmail === item.userEmail || isInCart}
                            className={`
                                w-full py-3 rounded-lg text-white font-bold transition-all duration-300
                                ${userEmail === item.userEmail 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : isInCart 
                                    ? 'bg-green-500 hover:bg-green-600' 
                                    : 'bg-blue-500 hover:bg-blue-600'}
                            `}
                        >
                            {isInCart ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* Right Side - Category Icon */}
                <div className="w-1/3 hidden md:block">
                    <div className="w-64 h-64 opacity-70">
                        {CategoryIcons[item.category] || CategoryIcons.Other}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Item;