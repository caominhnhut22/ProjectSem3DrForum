// AdminRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Make sure to use the correct path to AdminLayout
import AdminLayout from '../Layout/AdminLayout';

const AdminRoute = ({ element }) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const role = decodedToken['Role'];

    if (role === 'Admin') {
      return <AdminLayout>{element}</AdminLayout>;
    } else {
      console.log('Redirecting to /unauthorized');
      return <Navigate to="/unauthorized" />;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    console.log('Redirecting to /login due to decoding error');
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
