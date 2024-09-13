// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element }) => {
  if (!element) {
    return null; 
  }

  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode(token);
  const role = decodedToken['Role'];

  if (role === 'User') {
    return element;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

export default ProtectedRoute;
