import axios from 'axios';

const BASE_URL = 'http://localhost:5003/api/Question';

const QuestionApi = {
  getAllQuestions: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllQuestions`);
      return response.data;
    } catch (error) {
      console.error('Error getting all questions:', error);
      throw error;
    }
  },

  getAllUnacceptedQuestions: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllUnacceptedQuestions`);
      return response.data;
    } catch (error) {
      console.error('Error getting all unaccepted questions:', error);
      throw error;
    }
  },

  getQuestionsBySpecializationId: async (specializationId, page, pageSize) => {
    try {
      const url = specializationId
        ? `${BASE_URL}/getQuestionsBySpecializationId/${specializationId}`
        : `${BASE_URL}/getQuestionsBySpecializationId`;
  
      const response = await axios.get(url, {
        params: {
          page,
          pageSize,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error getting questions by specialization id:', error);
      throw error;
    }
  },

  getTotalQuestionsBySpecializationId: async (specializationId) => {
    try {
      const response = await axios.get(`${BASE_URL}/getTotalQuestionsBySpecializationId/${specializationId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting total questions by specialization id:', error);
      throw error;
    }
  },

  getQuestionById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/getQuestionById/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting question by id:', error);
      throw error;
    }
  },

  createQuestion: async (createQuestionDTO) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${BASE_URL}/createQuestion`,
        createQuestionDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  updateQuestion: async (id, editQuestionDTO) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${BASE_URL}/updateQuestion/${id}`,
        editQuestionDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating question with ID ${id}:`, error);
      throw error;
    }
  },

  deleteQuestion: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(`${BASE_URL}/deleteQuestion/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting question with ID ${id}:`, error);
      throw error;
    }
  },

  changeIsAccepted: async (id, changeIsAcceptedDTO) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${BASE_URL}/changeIsAccepted/${id}`,
        changeIsAcceptedDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error changing IsAccepted for question with ID ${id}:`, error);
      throw error;
    }
  },
};

export default QuestionApi;
