import React, { useState } from 'react';
import axios from 'axios'; 
import { Navigate } from 'react-router-dom';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [loguser, setLoguser] = useState({
    email: '',
    password: ''
  });

  const [redirectPath, setRedirectPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const submithandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/login', loguser);
      const { message, token, user_id, role } = response.data; 

      if (token) {
        localStorage.setItem("authToken", token);  
        localStorage.setItem("userId", user_id);
        localStorage.setItem("role", role);

        if (role === 'student') {
          setRedirectPath('/student');
        } else if (role === 'teacher') {
          setRedirectPath('/teacher');
        }
      } else {
        setError("Login failed: User not found");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.response?.data?.message || "Login failed: Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const Changehandler = (e) => {
    const { name, value } = e.target;
    setLoguser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🔍</span>
            <span>AI Plagiarism Checker</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={submithandler} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              value={loguser.email} 
              onChange={Changehandler} 
              placeholder="Enter your email"
              required
            />
            <i className="fas fa-envelope input-icon"></i>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              value={loguser.password} 
              onChange={Changehandler} 
              placeholder="Enter your password"
              required
            />
            <i className="fas fa-lock input-icon"></i>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/signin">Sign Up</Link></p>
        </div>
      </div>

      <div className="login-illustration">
        <img src="https://illustrations.popsy.co/amber/secure-login.svg" alt="Secure login" />
        <div className="features-list">
          <div className="feature-item">
            <i className="fas fa-check-circle"></i>
            <span>AI-powered plagiarism detection</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-check-circle"></i>
            <span>Detailed similarity reports</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-check-circle"></i>
            <span>Secure document handling</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;