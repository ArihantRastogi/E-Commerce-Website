import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const BoughtItems = () => {
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
                const { data } = await axios.get(`http://localhost:4000/api/order/boughtitems?userId=${userId}`);
                setItems(data);
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

    const filteredItems = items.filter(item => {
        const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        return matchesSearchTerm && matchesCategory;
    });

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
        <h1 className="text-3xl font-bold mb-6 text-center">Bought Items</h1>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearch}
            className="border p-2 rounded w-full"
          />
          <div className="relative ml-4">
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
              className="border rounded-lg shadow-md p-4 transition-all hover:shadow-lg"
            >
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

export default BoughtItems;