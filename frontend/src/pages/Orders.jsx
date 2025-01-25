import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
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
                const { data } = await axios.get(`http://localhost:4000/api/order?userId=${userId}`);
                setOrders(data);
                setLoading(false);

                // Fetch reviews for each order
                const reviewsPromises = data.map(async (order) => {
                    try {
                        const reviewResponse = await axios.post('http://localhost:4000/api/review/get', { orderId: order._id });
                        return reviewResponse.data.success ? reviewResponse.data.review : null;
                    } catch (error) {
                        console.error(`Error fetching review for order ${order._id}:`, error);
                        return null;
                    }
                });

                const reviewsResults = await Promise.all(reviewsPromises);
                setReviews(reviewsResults.filter(review => review !== null));
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

    const handleRegenerateOTP = async (orderId) => {
        try {
            const response = await axios.post('http://localhost:4000/api/order/regenerateOtp', { orderId });
            if (response.data.success) {
                window.location.reload();
            } else {
                alert('Error regenerating OTP');
            }
        } catch (error) {
            console.error('Error regenerating OTP:', error);
            alert('Error regenerating OTP');
        }
    };

    const fetchReview = async (orderId) => {
        try {
            console.log('orderId:', orderId);
            const response = await axios.post('http://localhost:4000/api/review/get', { orderId });
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

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData({
            ...reviewData,
            [name]: value
        });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('reviewData:', reviewData);
            const response = await axios.post('http://localhost:4000/api/review/add', reviewData);
            if (response.data.success) {
                alert('Review submitted successfully');
                window.location.reload();
                setShowReviewForm(false);
            } else {
                alert('Error submitting review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review');
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
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
      
      {/* Table-like layout */}
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-10 gap-2 bg-gray-100 p-2 font-bold text-center">
        <div className="col-span-2">Order ID</div>
        <div>Status</div>
        <div>Amount</div>
        <div className="col-span-2">Buyer</div>
        <div className="col-span-2">Seller</div>
        <div>Order Date</div>
        <div>Actions</div>
        </div>
        
        <div className="divide-y divide-gray-200">
        {orders.map(order => (
          <div 
          key={order._id} 
          className="grid grid-cols-10 gap-2 p-2 text-center hover:bg-gray-50 transition-colors"
          >
          <div className="col-span-2">{order._id}</div>
          <div className={order.transactionStatus === 'Pending' ? 'text-orange-500' : 'text-green-700'}>
            {order.transactionStatus}
          </div>
          <div>₹{order.amount.toFixed(2)}</div>
          <div className="col-span-2">{order.buyerEmail}</div>
          <div className="col-span-2">{order.sellerEmail}</div>
          <div>{new Date(order.createdAt).toLocaleDateString()}</div>
          <div>
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
                  onClick={() => {
                      setReviewData({ ...reviewData, orderId: order._id });
                      setShowReviewForm(true);
                  }} 
                  className="p-1 bg-blue-500 text-white rounded"
                >
                  Write a Review
                </button>
              )
            ) : (
              <button 
                onClick={() => handleRegenerateOTP(order._id)} 
                className="p-1 text-gray-500 rounded"
              >
                {order.otp}↺
              </button>
            )}
          </div>
          </div>
        ))}
        </div>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-2xl mb-4">Write a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Rating</label>
                <input
                  type="range"
                  name="rating"
                  value={reviewData.rating}
                  onChange={handleReviewChange}
                  className="w-full"
                  min="1"
                  max="5"
                  step="1"
                  required
                />
                <div className="text-center mt-2">{reviewData.rating}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Comment</label>
                <textarea
                  name="comment"
                  value={reviewData.comment}
                  onChange={handleReviewChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                Submit Review
              </button>
              <button 
                type="button" 
                onClick={() => setShowReviewForm(false)} 
                className="w-full bg-gray-500 text-white p-2 rounded mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

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

export default Orders;