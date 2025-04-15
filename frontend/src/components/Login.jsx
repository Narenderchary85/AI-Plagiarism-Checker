import React, { useState } from 'react';
import axios from 'axios'; 
import './Login.css';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [loguser, setLoguser] = useState({
    email: '',
    password: ''
  });

  const [redirectPath, setRedirectPath] = useState(null); 


  const submithandler = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/login', loguser);
        const { message, token, user_id, role } = response.data; 

        if (token) {
            localStorage.setItem("authToken", token);  
            localStorage.setItem("userId", user_id);
            localStorage.setItem("role", role);

            console.log("User ID:", user_id, "Role:", role);
            alert(message);

            if (role === 'student') {
                setRedirectPath('/student');
            } else if (role === 'teacher') {
                setRedirectPath('/teacher');
            }
        } else {
            alert("Login failed: User not found");
        }
    } catch (err) {
        console.error("Error during login:", err);
        alert("Login failed: Invalid credentials");
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
    <div className='login'>
      <form onSubmit={submithandler} className='formdiv'>
        <div className="logname">Email:</div>
        <input 
          type="email" 
          name="email" 
          className='nameinput' 
          value={loguser.email} 
          onChange={Changehandler} 
          placeholder="Enter your email"
          required
        />

        <div className="logpassword">Password:</div>
        <input 
          type="password" 
          name="password" 
          className='passwordinput' 
          value={loguser.password} 
          onChange={Changehandler} 
          placeholder="Enter your password"
          required
        />

        <button className='btn' type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
