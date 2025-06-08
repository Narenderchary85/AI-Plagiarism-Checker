import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isFocused, setIsFocused] = useState({
    username: false,
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', user);
      setIsSignedUp(true);
    } catch (err) {
      console.log(err);
    }
  };

  if (isSignedUp) {
    return <Navigate to='/login' />;
  }

  return (
    <div className='register-container'>
      <div className='register-left-panel'>
        <div className='logo-container'>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className='logo'>EduPlatform</span>
            <p className='tagline'>The future of learning starts here</p>
          </motion.div>
        </div>
        <div className='illustration-container'>
        </div>
      </div>

      <div className='register-right-panel'>
        <motion.div 
          className='register-form-container'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='form-header'>
            <h1>Create your account</h1>
            <p>Start your educational journey today</p>
          </div>

          <form className="register-form" onSubmit={submitHandler}>
            <div className={`input-container ${isFocused.username ? 'focused' : ''}`}>
              <label>Full name</label>
              <input
                type='text'
                name='username'
                value={user.username}
                onChange={handleChange}
                onFocus={() => handleFocus('username')}
                onBlur={() => handleBlur('username')}
                placeholder='Enter your full name'
                required
              />
              <motion.div 
                className="underline"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isFocused.username ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className={`input-container ${isFocused.email ? 'focused' : ''}`}>
              <label>Email address</label>
              <input
                type='email'
                name='email'
                value={user.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                placeholder='Enter your email'
                required
              />
              <motion.div 
                className="underline"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isFocused.email ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className={`input-container ${isFocused.password ? 'focused' : ''}`}>
              <label>Password</label>
              <input
                type='password'
                name='password'
                value={user.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                placeholder='Create a password'
                required
              />
              <motion.div 
                className="underline"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isFocused.password ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className='role-container'>
              <label>I am a</label>
              <div className='role-options'>
                <motion.button
                  type='button'
                  className={`role-option ${user.role === 'student' ? 'active' : ''}`}
                  onClick={() => setUser({...user, role: 'student'})}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Student
                </motion.button>
                <motion.button
                  type='button'
                  className={`role-option ${user.role === 'teacher' ? 'active' : ''}`}
                  onClick={() => setUser({...user, role: 'teacher'})}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Teacher
                </motion.button>
              </div>
            </div>

            <motion.button 
              className='submit-button'
              type='submit'
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Continue
            </motion.button>
          </form>

          <div className='auth-divider'>
            <span>or</span>
          </div>


          <div className='login-redirect'>
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;