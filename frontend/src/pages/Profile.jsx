import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    newPassword: '' // Initialize newPassword
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = Cookies.get('userEmail');
      try {
        const response = await axios.post(`http://localhost:4000/api/user/details`, { email });
        if (response.data.success) {
          setUserDetails(response.data.user);
          setFormData({
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            contactNumber: response.data.user.contactNumber,
            newPassword: '' // Ensure newPassword is included
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const checkToken = async () => {
      const token = Cookies.get('token');
      const email = Cookies.get('userEmail');
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post('http://localhost:4000/api/user/checkToken', { token });
        if (response.data.success) {
          setIsLoggedIn(true);
          setUserEmail(email);
          fetchUserDetails(email);
        } else {
          Cookies.remove('token');
          Cookies.remove('userEmail');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        Cookies.remove('token');
        Cookies.remove('userEmail');
      }
      setLoading(false);
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

  const handleSave = async () => {
    if (formData.newPassword.trim() === '') {
      setError('New password cannot be empty');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/api/user/update', {
        email: userEmail,
        ...formData
      },
      { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      );
      if (response.data.success) {
        setUserDetails(response.data.user);
        setIsEditing(false);
        setError(null); // Clear error on success
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      setError('Error updating user details');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl mb-4">Profile</h1>
        <p className="mb-4"><strong>Email:</strong> {userEmail}</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {userDetails && (
          <div>
            {isEditing ? (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
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
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-4"><strong>First Name:</strong> {userDetails.firstName}</p>
                <p className="mb-4"><strong>Last Name:</strong> {userDetails.lastName}</p>
                <p className="mb-4"><strong>Contact Number:</strong> {userDetails.contactNumber}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
