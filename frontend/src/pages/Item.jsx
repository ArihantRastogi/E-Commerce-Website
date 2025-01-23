import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Item = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

        checkToken();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{item.name}</h1>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Seller: {item.userEmail}</p>
        </div>
    );
};

export default Item;
