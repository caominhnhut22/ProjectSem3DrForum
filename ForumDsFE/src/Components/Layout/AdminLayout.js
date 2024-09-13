import React from 'react';
import Navbar from '../Navbar/AdminNavbar';
import Footer from '../Footer/AdminFooter';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default AdminLayout;  
