import React, { useState } from "react";
import './LoginSignup.css';
import axios from 'axios';
import {useNavigate, useLocation} from "react-router-dom";

import user_icon from '../../Assets/person.png';
import email_icon from '../../Assets/email.png';
import password_icon from '../../Assets/password.png';


function LoginSignupForm() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get the intended destination from the state, default to home page
    const from = location.state?.from?.pathname || '/';
    
  // State to switch between Login and Register
  const [isLogin, setIsLogin] = useState(true);

  // State for user input
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      alert(res.data.message || 'Registered!');

      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Register failed');
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email: formData.email,
        password: formData.password
      });
      
      // Store user authentication in localStorage
      localStorage.setItem('user', JSON.stringify({
        user_id: res.data.user_id,
        email: res.data.email,
        isAuthenticated: true
      }));
      
      alert(res.data.message || 'Logged in!');
      
      // Redirect to the intended destination or home page
      navigate(from, { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2 className='header'>{isLogin ? 'Login' : 'Sign Up'}</h2>

      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        {!isLogin && (

          <div className="input-icon">
            <img src={user_icon} alt="User Icon" />
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="input-icon">
          <img src={email_icon} alt="Email Icon" />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-icon">
          <img src={password_icon} alt="Password Icon" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>

      <p onClick={() => setIsLogin(!isLogin)} className="switch-form">
        {isLogin
          ? "Don't have an account? Register here"
          : "Already have an account? Login here"}
      </p>
    </div>
  );
}

export default LoginSignupForm;
