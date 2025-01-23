import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await axios.post('http://localhost:4000/api/user/checkToken', { token });
        if (response.data.success) {
          setIsLoggedIn(true);
        } else {
          Cookies.remove('token');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        Cookies.remove('token');
      }
    };

    checkToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/user/register', formData);
      if (response.data.success) {
        navigate('/login'); // Redirect to login page
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
