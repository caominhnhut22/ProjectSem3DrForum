import axios from 'axios';

const BASE_URL = 'http://localhost:5003/api/Auth';

const AuthApi = {
  login: async (loginData) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, loginData);
      const { token } = response.data;
      return { token };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  auth: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${BASE_URL}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking user authentication:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${BASE_URL}/logout`);
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  getLoggedInUsersCount: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getLoggedInUsersCount`);
      return response.data;
    } catch (error) {
      console.error('Error fetching logged-in users count:', error);
      throw error;
    }
  },
};

export default AuthApi;
