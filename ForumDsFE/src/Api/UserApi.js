// src/api/UserApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5003/api/User';

const UserApi = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllUsers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${BASE_URL}/getUserById/${userId}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  getSpecializationUsers: async (specializationId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${BASE_URL}/getUsersBySpecialization/${specializationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching specialization users:', error);
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getStatistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  },

  register: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, formData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  verifyEmail: async (verifyEmailDTO) => {
    try {
      const response = await axios.post(`${BASE_URL}/verify-email`, verifyEmailDTO);
      return response.data;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  },

  deleteAccount: async (userId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete-user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  },

  
  register: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, formData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  changePassword: async (userId, changePasswordDTO) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${BASE_URL}/change-password/${userId}`,
        changePasswordDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error changing user password:', error);
      throw error;
    }
  },

  editProfile: async (userId, formData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
          `${BASE_URL}/edit-profile/${userId}`,
          formData,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      return response.data;
    } catch (error) {
      console.error('Error editing user profile:', error);
      throw error;
    }
  },

  changeStatus: async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${BASE_URL}/change-status/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error changing user status:', error);
      throw error;
    }
  },
};

export default UserApi;
