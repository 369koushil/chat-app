import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User.context';
import axiosInstance from '../config/axiosInstance';

const UserAuth = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        try {
          const response = await axiosInstance.get('/user/getProfile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
          navigate('/login');
        }
      } else if (!token) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token, user, setUser, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserAuth;