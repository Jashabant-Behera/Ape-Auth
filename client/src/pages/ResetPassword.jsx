import React, { useContext, useState, useRef } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import '../style/ResetPassword.css';

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const { backendURL } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [OTP, setOTP] = useState('');
  const [OTPSubmit, setOTPSubmit] = useState(false);

  const inputRefs = useRef([]);

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendURL}/api/auth/resetOTP`, {
        email,
      });

      if (data.success) {
        toast.success(data.message);
        setEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const OTPArray = inputRefs.current.map((el) => el.value);
    const enteredOTP = OTPArray.join('');

    setOTP(enteredOTP);
    setOTPSubmit(true);
  };

  const handleInput = (e, index) => {
    if (e.target.value.length === 1 && index < inputRefs.current.length - 1) {
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
    const paste = e.clipboardData.getData('text').slice(0, 6);

    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendURL}/api/auth/resetPassword`,
        { email, OTP, newPassword }
      );

      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div
      className={`reset-container ${!emailSent ? 'email-stage' : OTPSubmit ? 'password-stage' : 'otp-stage'}`}
    >
      <div className="reset-box">
        <div className="logo-container">
          <img
            onClick={() => navigate('/')}
            src={assets.logo_icon}
            alt="Logo"
            className="logo"
          />
        </div>

        {!emailSent && (
          <form onSubmit={onSubmitEmail}>
            <h1>Reset Password</h1>
            <p>Enter your registered email address</p>
            <div className="reset-input">
              <img src={assets.mail_icon} alt="Mail Icon" />
              <input
                type="email"
                placeholder="Email Id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}

        {!OTPSubmit && emailSent && (
          <form onSubmit={onSubmitOTP}>
            <h1>Verify OTP</h1>
            <p>Enter the 6-digit code sent to your email</p>
            <div className="otp-container" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    required
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    pattern="\d*"
                    inputMode="numeric"
                  />
                ))}
            </div>
            <button type="submit">Submit</button>
          </form>
        )}

        {OTPSubmit && (
          <form onSubmit={onSubmitNewPassword}>
            <h1>Set New Password</h1>
            <div className="reset-input">
              <img src={assets.key_icon} alt="Key Icon" />
              <input
                type="password"
                placeholder="New Password"
                autocomplete="current-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
