import React, { useContext } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

import '../style/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const { userData, backendURL, setUserData, setIsLoggedin } =
    useContext(AppContext);

  const verifyOTP = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendURL + '/api/auth/verifyOTP');

      if (data.success) {
        navigate('/emailVerify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + '/api/auth/logout');

      toast.success(data.message);
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="navbar">
      <div className="logo-container" onClick={() => navigate('/')}>
        <img src={assets.logo_icon} alt="Logo" className="logo" />
      </div>

      {userData ? (
        <div className="user-menu">
          <img src={assets.monkey_icon} alt="Logo" className="monkeylogo" />
          {userData.name.toUpperCase()}
          <div className="dropdown">
            <ul className="dropdown-list">
              {!userData.isAccountVerified && (
                <li
                  onClick={verifyOTP}
                  key="verify-email"
                  className="dropdown-item"
                >
                  Verify Email
                </li>
              )}
              <li
                key="logout"
                onClick={logout}
                className="logout"
              >
                Logout
                <img
                  src={assets.logout_icon}
                  alt="Logout Icon"
                  className="icon"
                />
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button onClick={() => navigate('/login')} className="login-btn">
          Login
          <img src={assets.login_icon} alt="Login Icon" className="icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
