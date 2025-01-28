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
    const [showReview, setShowReview] = useState(false);
    const [reviewData, setReviewData] = useState({
        orderId: '',
        rating: '',
        comment: ''
    });
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchOrders = async (userId) => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/order/deliver?userId=${userId}`);
                setOrders(data);
                
                // Fetch items for each order and store in an object keyed by order ID
                const itemsPromises = data.map(async (order) => {
                    try {
                        const itemsResponse = await axios.post('http://localhost:4000/api/order/getOrderedItems', 
                        { order: order._id },
                        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
                        );
                        return { [order._id]: itemsResponse.data };
                    } catch (error) {
                        console.error(`Error fetching items for order ${order._id}:`, error);
                        return { [order._id]: [] };
                    }
                });

                const itemsResults = await Promise.all(itemsPromises);
                const itemsMap = itemsResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                
                setItemsByOrder(itemsMap);

                // Fetch reviews for each order
                const reviewsPromises = data.map(async (order) => {
                    try {
                        const reviewResponse = await axios.post('http://localhost:4000/api/review/get', 
                        { orderId: order._id },
                        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
                        );
                        return reviewResponse.data.success ? reviewResponse.data.review : null;
                    } catch (error) {
                        console.error(`Error fetching review for order ${order._id}:`, error);
                        return null;
                    }
                });

                const reviewsResults = await Promise.all(reviewsPromises);
                setReviews(reviewsResults.filter(review => review !== null));

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
            const response = await axios.post('http://localhost:4000/api/order/verifyOtp', { 
              orderId, 
              otp 
            },
            { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
            );
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

    const fetchReview = async (orderId) => {
        try {
            const response = await axios.post('http://localhost:4000/api/review/get', 
            { orderId },
            { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
            );
            if (response.data.success) {
                setReviewData(response.data.review);
                setShowReview(true);
            } else {
                alert('Error fetching review');
            }
        } catch (error) {
            console.error('Error fetching review:', error);
            alert('Error fetching review');
        }
    };

    const isReviewPublished = (orderId) => {
        return reviews.some(review => review.orderId === orderId);
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
        <div className="grid grid-cols-10 gap-2 bg-gray-100 p-2 font-bold text-center">
        <div className='col-span-2'>Order ID</div>
        <div>Status</div>
        <div>Items</div>
        <div>Amount</div>
        <div className='col-span-2'>Buyer</div>
        <div>Order Date</div>
        <div className='col-span-2'>Actions</div>
        </div>
        
        <div className="divide-y divide-gray-200">
        {orders.map(order => (
          <div 
          key={order._id} 
          className="grid grid-cols-10 gap-2 p-2 text-center hover:bg-gray-50 transition-colors"
          >
          <div className='col-span-2'>{order._id}</div>
          <div className={order.transactionStatus === 'Pending' ? 'text-orange-500' : 'text-green-700'}>
            {order.transactionStatus}
          </div>
          <div>
            {itemsByOrder[order._id] ? 
              itemsByOrder[order._id].map(item => item.name).join(', ') : 
              'Loading...'
            }
          </div>
          <div>₹{order.amount.toFixed(2)}</div>
          <div className='col-span-2'>{order.buyerEmail}</div>
          <div>{new Date(order.createdAt).toLocaleDateString()}</div>
          <div className='col-span-2'>
            {order.transactionStatus === 'Completed' ? (
              isReviewPublished(order._id) ? (
                <button 
                  onClick={() => fetchReview(order._id)} 
                  className="p-1 bg-green-700 text-white rounded"
                >
                  View Review
                </button>
              ) : (
                <button 
                  className="p-1 bg-red-600 text-white rounded cursor-not-allowed" disabled={true}
                >
                  Review Not Made
                </button>
              )
            ) : (
              <form onSubmit={(e) => {
                  e.preventDefault();
                  const otp = e.target.elements.otp.value;
                  handleOTPSubmit(order._id, otp);
              }} className="flex items-center">
                  <input type="text" name="otp" placeholder="Enter OTP" className="border p-1 rounded w-24" />
                  <button type="submit" className="ml-2 p-1 w-24 bg-blue-500 text-white rounded">Submit</button>
              </form>
            )}
          </div>
          </div>
        ))}
        </div>
      </div>

      {showReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-2xl mb-4">Review</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Rating</label>
              <p className="w-full p-2 border border-gray-300 rounded mt-1">{reviewData.rating}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Comment</label>
              <p className="w-full p-2 border border-gray-300 rounded mt-1">{reviewData.comment}</p>
            </div>
            <button 
              type="button" 
              onClick={() => setShowReview(false)} 
              className="w-full bg-gray-500 text-white p-2 rounded mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    );
};

export default Deliver;