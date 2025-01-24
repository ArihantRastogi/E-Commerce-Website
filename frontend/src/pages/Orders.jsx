import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchOrders = async (userId) => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/order?userId=${userId}`);
                setOrders(data);
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
                    fetchOrders(response.data.userId);
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
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
      
      {/* Table-like layout */}
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 bg-gray-100 p-2 font-bold text-center">
        <div>Order ID</div>
        <div>Status</div>
        <div>Amount</div>
        <div>Buyer</div>
        <div>Seller</div>
        <div>Order Date</div>
        <div>OTP</div>
        </div>
        
        <div className="divide-y divide-gray-200">
        {orders.map(order => (
          <div 
          key={order._id} 
          className="grid grid-cols-7 gap-2 p-2 text-center hover:bg-gray-50 transition-colors"
          >
          <div>{order._id}</div>
          <div className={order.transactionStatus === 'Pending' ? 'text-orange-500' : ''}>
            {order.transactionStatus}
          </div>
          <div>₹{order.amount.toFixed(2)}</div>
          <div>{order.buyerEmail}</div>
          <div>{order.sellerEmail}</div>
          <div>{new Date(order.createdAt).toLocaleDateString()}</div>
          <div>{order.otp}</div>
          </div>
        ))}
        </div>
      </div>
      </div>
    );
};

export default Orders;