import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthenticationContext = createContext();

const BASE_URL = 'http://localhost:6001';

const AuthenticationContextProvider = ({ children }) => {

  const [username, setUsername]   = useState('');
  const [email,    setEmail]      = useState('');
  const [password, setPassword]   = useState('');

  const navigate = useNavigate();

  const storeUserData = (data) => {
    localStorage.setItem('userToken',  data.token);
    localStorage.setItem('userId',     data.user._id);
    localStorage.setItem('username',   data.user.username);
    localStorage.setItem('email',      data.user.email);
    localStorage.setItem('profilePic', data.user.profilePic);
    localStorage.setItem('posts',      JSON.stringify(data.user.posts));
    localStorage.setItem('followers',  JSON.stringify(data.user.followers));
    localStorage.setItem('following',  JSON.stringify(data.user.following));
  };

  const login = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });
      storeUserData(res.data);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
    }
  };

  const register = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/register`, { username, email, password });
      storeUserData(res.data);
      navigate('/');
    } catch (err) {
      console.error('Register failed:', err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    ['userToken','userId','username','email','profilePic','posts','followers','following']
      .forEach(key => localStorage.removeItem(key));
    navigate('/landing');
  };

  return (
    <AuthenticationContext.Provider value={{
      login, register, logout,
      username, setUsername,
      email,    setEmail,
      password, setPassword,
    }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;