import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import UserApi from '../../../Api/UserApi';
import { useAuth } from '../../../Contexts/AuthProvider';
import AuthApi from '../../../Api/AuthApi';
import NavbarAdmin from '../../../Components/Navbar/AdminNavbar';

function getStatusString(status) {
  switch (status) {
    case 0:
      return 'Registered';
    case 1:
      return 'Verification Sent';
    case 2:
      return 'Verified';
    case 3:
      return 'Completed';
    default:
      return 'Unknown Status';
  }
}

function AdminDashboard({ setIsNavbarVisible, setIsFooterVisible }) {
  const [users, setUsers] = useState([]);
  const [shouldRenderLayout, setShouldRenderLayout] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    setIsNavbarVisible(false);
    setIsFooterVisible(false);
    getAllUsers();
  }, [setIsNavbarVisible, setIsFooterVisible]);

  const getAllUsers = async () => {
    try {
      const usersData = await UserApi.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      // Handle error as needed
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const user = await AuthApi.auth();
          const isAdmin = user?.role === 'Admin';
          setShouldRenderLayout(isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdmin();
  }, []);

  if (!shouldRenderLayout) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await AuthApi.logout();
      localStorage.removeItem('accessToken');
      setUsers([]);
      logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="home-flex-container">
      <div className="home-post">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Is Public</th>
              <th>Status</th>
              <th>Specialization</th>
              <th>Avatar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
                <td>{user.experience} Year</td>
                <td>{user.isPublic ? 'Yes' : 'No'}</td>
                <td>{getStatusString(user.status)}</td>
                <td>{user.specializationName}</td>
                <td>
                  <img src={user.avatar} alt="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <hr className="home-hr" />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
