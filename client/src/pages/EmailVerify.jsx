import React, { useContext, useEffect, useState, useRef } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../style/EmailVerify.css'

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { backendURL, isLoggedin, userData, getUserData } =
    useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('').slice(0, 6);

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const OTPArray = inputRefs.current.map((e) => e.value);
      const OTP = OTPArray.join('');

      if (OTP.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP.');
        return;
      }

      const { data } = await axios.post(
        backendURL + '/api/auth/verifyAccount',
        { OTP }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/');
  }, [isLoggedin, userData]);

  return (
    <div className="email-verify-container">
      <div className="email-verify-box">
        <div>
          <img
            onClick={() => navigate('/')}
            src={assets.logo_icon}
            alt="Logo"
            className="w-10 cursor-pointer"
          />
        </div>

        <form onSubmit={onSubmitHandler}>
          <h1>Email Verification</h1>
          <p>Enter the 6-Digit Code sent to your email</p>
          <div className="verification-inputs" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  pattern="\d*"
                  inputMode="numeric"
                />
              ))}
          </div>
          <button type="submit">Verify Email</button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
