import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Deliver = () => {
    const [orders, setOrders] = useState([]);
    const [itemsByOrder, setItemsByOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sellerEmail, setSellerEmail] = useState('');

    useEffect(() => {
        const fetchOrders = async (userId) => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/order/deliver?userId=${userId}`);
                setOrders(data);
                
                // Fetch items for each order and store in an object keyed by order ID
                const itemsPromises = data.map(async (order) => {
                    try {
                        const itemsResponse = await axios.post('http://localhost:4000/api/order/getOrderedItems', { order: order._id });
                        return { [order._id]: itemsResponse.data };
                    } catch (error) {
                        console.error(`Error fetching items for order ${order._id}:`, error);
                        return { [order._id]: [] };
                    }
                });

                const itemsResults = await Promise.all(itemsPromises);
                const itemsMap = itemsResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                
                setItemsByOrder(itemsMap);
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
                    setSellerEmail(response.data.userEmail);
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

    const handleOTPSubmit = async (orderId, otp) => {
        try {
            const response = await axios.post('http://localhost:4000/api/order/verifyOtp', { orderId, otp });
            if (response.data.success) {
                window.location.reload();
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP');
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
      <h1 className="text-3xl font-bold mb-6 text-center">Deliver Orders</h1>
      
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 bg-gray-100 p-2 font-bold text-center">
        <div>Order ID</div>
        <div>Status</div>
        <div>Items</div>
        <div>Amount</div>
        <div>Buyer</div>
        <div>Order Date</div>
        <div>Enter OTP</div>
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
          <div>
            {itemsByOrder[order._id] ? 
              itemsByOrder[order._id].map(item => item.name).join(', ') : 
              'Loading...'
            }
          </div>
          <div>₹{order.amount.toFixed(2)}</div>
          <div>{order.buyerEmail}</div>
          <div>{new Date(order.createdAt).toLocaleDateString()}</div>
          <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const otp = e.target.elements.otp.value;
                handleOTPSubmit(order._id, otp);
            }} className="flex items-center">
                <input type="text" name="otp" placeholder="Enter OTP" className="border p-1 rounded w-24" />
                <button type="submit" className="ml-2 p-1 w-24 bg-blue-500 text-white rounded">Submit</button>
            </form>
          </div>
          </div>
        ))}
        </div>
      </div>
      </div>
    );
};

export default Deliver;