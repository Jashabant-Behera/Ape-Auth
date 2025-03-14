import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendURL = 'https://ape-authentication.up.railway.app';
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = backendURL;

  if (!backendURL) {
    console.error(
      'VITE_BACKEND_URL is not defined in the environment variables.'
    );
    console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
  }

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  useEffect(() => {
    const getAuthState = async () => {
      try {
        const { data } = await axios.get('/api/auth/isAuth');
        if (data.success) {
          setIsLoggedin(true);
          getUserData();
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    getAuthState();
  }, []);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/data`);
      console.log('User Data Fetched:', data);
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(data.message);
    }
  };

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
