import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Cart = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchItems = async (userId) => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/cart?userId=${userId}`);
                const availableItems = data.filter(item => item.status === 'available');
                setItems(availableItems);
                // setItems(data);
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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategories(prevCategories =>
            prevCategories.includes(category)
                ? prevCategories.filter(c => c !== category)
                : [...prevCategories, category]
        );
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const userEmail = Cookies.get('userEmail');
            await axios.post('http://localhost:4000/api/cart/delete', {
                userEmail: userEmail,
                productId: itemId
            });
            window.location.reload();
        } catch (error) {
            console.error('Error removing item from cart:', error);
            alert('Failed to remove item from cart');
        }
    };

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handlePlaceOrder = async () => {
        const buyerEmail = Cookies.get('userEmail');
        const groupedItems = items.reduce((acc, item) => {
            if (!acc[item.sellerId]) {
                acc[item.sellerId] = [];
            }
            acc[item.sellerId].push(item);
            return acc;
        }, {});

        try {
            for (const sellerId in groupedItems) {
                const items = groupedItems[sellerId];
                const amount = items.reduce((total, item) => total + item.price, 0);
                const otp = generateOtp();
                const Items = items.map(item => item._id);
                console.log({ buyerEmail, sellerId, amount, otp, Items });

                const response = await axios.post('http://localhost:4000/api/order/add', {
                    buyerEmail,
                    sellerId,
                    amount,
                    otp,
                    Items
                });

                if (!response.data.success) {
                    alert(`Failed to place order for seller: ${sellerId}`);
                    return;
                }
                for (const item of items) {
                    console.log(item);
                    const response = await axios.post('http://localhost:4000/api/cart/update', {
                        buyerEmail: buyerEmail,
                        productId: item._id,
                        status: 'sold'
                    });
                    if (!response.data.success) {
                        alert(`Failed to update cart for item: ${item._id}`);
                        return;
                    }
                }
            }
            window.location.reload();
            // Optionally, you can clear the cart or navigate to another page
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        return matchesSearchTerm && matchesCategory;
    });

    const totalPrice = items.reduce((total, item) => total + item.price, 0);

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
          <h1 className="text-3xl font-bold mb-6 text-center">Cart</h1>
          <button 
            onClick={handlePlaceOrder} 
            className="bg-green-500 text-white p-2 rounded"
          >
            Place Order
          </button>
        </div>
        <div className="bg-gray-50 border rounded-lg p-4 mb-6 flex justify-between items-center">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
            <div className="flex flex-wrap gap-2">
              {items.map(item => (
                <span 
                  key={item._id} 
                  className="bg-white px-2 py-1 rounded-md text-sm"
                >
                  {item.name} - ₹{item.price.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
          <div className="text-xl font-bold bg-green-100 px-4 py-2 rounded-lg">
            Total: ₹{totalPrice.toFixed(2)}
          </div>
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search in cart..."
            value={searchTerm}
            onChange={handleSearch}
            className="border p-2 rounded w-full"
          />
          <div className="relative ml-4 z-10">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="border p-2 rounded bg-white"
            >
              Filter by Category
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <div className="p-2">
                  {['Books', 'Clothing', 'Electronics','Furniture', 'Grocery', 'Other'].map(category => (
                    <label key={category} className="block mb-2">
                      <input
                        type="checkbox"
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={handleCategoryChange}
                        className="mr-2"
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item._id} 
              className="relative border rounded-lg shadow-md p-4 transition-all hover:shadow-lg overflow-hidden"
            >
              <button 
                onClick={() => handleRemoveFromCart(item._id)} 
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
                <h2 className="text-xl font-semibold mb-2 text-blue-700 hover:text-blue-900 truncate">
                  {item.name}
                </h2>
              </Link>
              <p className="text-gray-600 mb-2 truncate">{item.description}</p>
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

export default Cart;