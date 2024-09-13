import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../../Api/AuthApi';
import { useAuth } from '../../Contexts/AuthProvider';

function Navbar() {
  const [click, setClick] = useState(false);
  const [userData, setUserData] = useState(null);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkUserLoggedIn();
  }, [isLoggedIn]);

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
    <nav className='navbar'>
      <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
        DsF
        <i className='fab fa-firstdraft' />
      </Link>
      <div className='menu-icon' onClick={handleClick}>
        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
      </div>
      <ul className={click ? 'nav-menu active' : 'nav-menu'}>
        <li className='nav-item'>
          <Link to='/' className='nav-links' onClick={closeMobileMenu}>
            Home
          </Link>
        </li>
        <li className='nav-item' onClick={closeMobileMenu}>
          <Link to='/post' className='nav-links' onClick={closeMobileMenu}>
            Post <i className='fas fa-caret-down' />
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/specializations' className='nav-links' onClick={closeMobileMenu}>
            Specializations
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/contact-us' className='nav-links' onClick={closeMobileMenu}>
            About Us
          </Link>
        </li>
        {userData ? (
          <li className='nav-item' onClick={closeMobileMenu}>
              <Link to='/personal' className='nav-links nav-pro'>
                Profile
              </Link>
              <button onClick={handleLogout} className='btn-joinus'>
                Logout
              </button>
          </li>
        ) : (
          <li className='nav-item'>
            <Link to='/login' className='nav-links' onClick={closeMobileMenu}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
