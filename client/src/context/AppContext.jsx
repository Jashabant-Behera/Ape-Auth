import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendURL = 'https://ape-authentication.up.railway.app';

  // Log the backendURL for debugging
  console.log('Backend URL:', backendURL);

  // Set Axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = backendURL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get('https://ape-authentication.up.railway.app/api/auth/isAuth');
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized error (e.g., log out the user)
        setIsLoggedin(false);
        setUserData(null);
        toast.error('Please log in again.');
      } else {
        toast.error(error.response?.data?.message || 'An error occurred.');
      }
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get('/api/user/data');
      console.log('User Data Fetched:', data);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized error (e.g., log out the user)
        setIsLoggedin(false);
        setUserData(null);
        toast.error('Please log in again.');
      } else {
        toast.error(error.response?.data?.message || 'An error occurred.');
      }
    }
  };

  useEffect(() => {
    getAuthState();
  }, []); // Empty dependency array ensures this runs only once

  const value = {
    backendURL,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
