import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../../Api/AuthApi';
import { useAuth } from '../../Contexts/AuthProvider';

function AdminNavbar() {
  const [click, setClick] = useState(false);
  const [userData, setUserData] = useState(null);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkUserLoggedIn();
  }, [isLoggedIn, location.pathname]);

  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const user = await AuthApi.auth();
        setUserData(user);
        checkTokenExpiration();
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error checking user login status:', error);
    }
  };

  const checkTokenExpiration = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (expirationTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > parseInt(expirationTime)) {
        handleLogout();
      }
    }
  };

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = async () => {
    try {
      await AuthApi.logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiration');
      setUserData(null);
      logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className='nav-admin'>
      <div className='head'>
        <div className='nav'>
          <ul>
            <li>
              <Link to='/admin'>Home</Link>
            </li>
            <li>
              <Link to='/admin/postmanage'>Post</Link>
            </li>
            <li>
              <Link to='/admin/specmanage'>Specializations</Link>
            </li>
            <li>
              <Link to='/admin/usermanage'>Users</Link>
            </li>
            <li>
              <Link to='#' onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
