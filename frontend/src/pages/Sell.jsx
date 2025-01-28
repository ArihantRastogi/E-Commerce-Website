import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Sell = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async (userId) => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/sell?userId=${userId}`);
                const availableItems = data.filter(item => item.status === 'available');
                setItems(availableItems);
                setLoading(false);
            } catch (error) {
                setError('Error fetching items');
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
                    fetchItems(response.data.userId);
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

        checkToken();
    }, []);

    const deleteItem = async (itemId) => {
        try {
            const response = await axios.post('http://localhost:4000/api/sell/delete', 
            { itemId },
            { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
            );
            // console.log(response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-xl text-gray-600">Loading...</div>
        </div>
    );

    if (!isLoggedIn) return <Navigate to="/login" />;

    if (error) return (
        <div className="flex justify-center items-center h-screen text-red-600">
            {error}
        </div>
    );

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Products</h1>
          <button 
            onClick={() => navigate('/sellitem')} 
            className="bg-green-500 text-white p-2 rounded"
          >
            Add New Item
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div 
              key={item._id} 
              className="relative border rounded-lg shadow-md p-4 transition-all hover:shadow-lg"
            >
              <button 
                onClick={() => deleteItem(item._id)} 
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  className="w-6 h-6"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
              <Link to={`/product/${item._id}`} className="block">
                <h2 className="text-xl font-semibold mb-2 text-blue-700 hover:text-blue-900">
                  {item.name}
                </h2>
              </Link>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="text-gray-600 mb-2">Category: {item.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-700">
                  ₹{item.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export default Sell;