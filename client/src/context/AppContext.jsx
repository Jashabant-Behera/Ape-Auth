import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendURL = "https://ape-authentication.up.railway.app";
  console.log("Backend URL:", backendURL);

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = backendURL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      setIsLoggedin(false);
      setUserData(null);
      toast.error("Please log in again.");
    } else {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const getAuthState = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/auth/isAuth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

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
