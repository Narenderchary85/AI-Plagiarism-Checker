import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student', // Default role
  });

  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', user);
      setUser({
        username: '',
        email: '',
        password: '',
        role: 'student',
      });
      setIsSignedUp(true);
    } catch (err) {
      console.log(err);
    }
  };

  if (isSignedUp) {
    return <Navigate to='/' />;
  }

  return (
    <div className='register'>
      <form className="form" onSubmit={submitHandler}>
        <div className='name'>NAME:</div>
        <input
          className='nameinput'
          type='text'
          name='username'
          value={user.username}
          onChange={handleChange}
          required
        />

        <div className='branch'>EMAIL:</div>
        <input
          className='branchinput'
          type='email'
          name='email'
          value={user.email}
          onChange={handleChange}
          required
        />

        <div className='age'>PASSWORD:</div>
        <input
          className='ageinput'
          type='password'
          name='password'
          value={user.password}
          onChange={handleChange}
          required
        />

        <div className='role'>ROLE:</div>
        <select className='roleinput' name='role' value={user.role} onChange={handleChange}>
          <option value='student'>Student</option>
          <option value='teacher'>Teacher</option>
        </select>

        <button className='btnf' type='submit'>Register</button>
      </form>
    </div>
  );
};

export default Register;
