import React, { useState, useEffect } from 'react';
import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import { Routes, Route } from 'react-router-dom';
import * as auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import App from './App';
import api from '../utils/api.js';

const Router = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handelLogin = (newEmail) => {
    setLoggedIn(true);
    setEmail(newEmail);
    navigate('/');
  };

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res.status === 400) {
            console.log(' Token not provided or provided in the wrong format ');
          }
          if (res.status === 401) {
            console.log('The provided token is invalid');
          }
          if (res) {
            handelLogin(res.data.email);
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.clear();
        });
    }
  };

  const handelLoginSubmit = ({ email, password }) => {
    auth
      .login(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          api.updateToken();
          handelLogin(email);
        }
        if (data.status === 400) {
          console.log(' one or more of the fields were not provided ');
        }
        if (data.status === 401) {
          console.log('the user with the specified email not found ');
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <ProtectedRoute isLoggedIn={loggedIn} email={email} component={App} />
        }
      />
      <Route
        path="/signin"
        element={<Login handelLoginSubmit={handelLoginSubmit} />}
      />
      <Route path="/signup" element={<Register />} />
    </Routes>
  );
};

export default Router;
