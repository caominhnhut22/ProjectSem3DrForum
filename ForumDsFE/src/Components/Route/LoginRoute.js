import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const LoginRoute = ({ element }) => {
  if (!element) {
    return null; 
  }

  const token = localStorage.getItem('accessToken');

  if (token) {
    return <Navigate to="/" />;
  } else {
    return element;
  }
};

export default LoginRoute;
