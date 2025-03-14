import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../style/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { backendURL, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmithandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendURL}/api/auth/signup`, {
          name,
          email,
          password,
        });

        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendURL}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className={`auth-container ${state === 'Sign Up' ? 'signup-bg' : 'login-bg'}`}
    >
      <div className="auth-box">
        <div>
          <img
            onClick={() => navigate('/')}
            src={assets.logo_icon}
            alt="Logo"
            className="w-10 cursor-pointer"
          />
        </div>

        <h1>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h1>
        <p>
          {state === 'Sign Up'
            ? 'Create Your Account'
            : 'Login to Your Account'}
        </p>

        <form onSubmit={onSubmithandler}>
          {state === 'Sign Up' && (
            <div className="auth-input">
              <img src={assets.people_icon} alt="People Icon" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="auth-input">
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Id"
              required
            />
          </div>

          <div className="auth-input">
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit">{state}</button>
          <span onClick={() => navigate('/resetPassword')}>
            Forgot Password?
          </span>
        </form>

        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span onClick={() => setState('Login')}>Login Here</span>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <span onClick={() => setState('Sign Up')}>Sign Up</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
