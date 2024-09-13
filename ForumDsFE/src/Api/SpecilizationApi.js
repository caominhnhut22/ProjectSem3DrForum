import axios from 'axios';

const BASE_URL = 'http://localhost:5003/api/Specialization'; // Make sure this matches your actual API endpoint

const SpecilizationApi = {
  getAllSpecializations: async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${BASE_URL}/getAllSpecializations`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching specializations:', error);
      throw error;
    }
  },

  getSpecializations: async (maxCount) => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = maxCount ? `${BASE_URL}/getSpecializations?maxCount=${maxCount}` : `${BASE_URL}/getSpecializations`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching specializations:', error);
      throw error;
    }
  },

  getSpecializationById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/getSpecilizationById/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching specialization with ID ${id}:`, error);
      throw error;
    }
  },

  createSpecialization: async (createSpecializationDTO) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${BASE_URL}/createSpecilization`,
        createSpecializationDTO, // Pass data in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating specialization:', error);
      throw error;
    }
  },
  
  updateSpecialization: async (id, updateSpecializationDTO) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `${BASE_URL}/updateSpecilization/${id}`,
        updateSpecializationDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(`Error updating specialization with ID ${id}:`, error);
      throw error;
    }
  },

  // Uncomment and implement the delete method if needed
  // deleteSpecialization: async (id) => {
  //   try {
  //     await axios.delete(`${BASE_URL}/${id}`);
  //   } catch (error) {
  //     console.error(`Error deleting specialization with ID ${id}:`, error);
  //     throw error;
  //   }
  // },
};

export default SpecilizationApi;
