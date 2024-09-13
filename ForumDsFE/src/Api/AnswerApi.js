import axios from 'axios';

const baseUrl = 'http://localhost:5003/api/Answer';

const AnswerApi = {
  createAnswer: async (createAnswerDTO) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${baseUrl}/createAnswer`, createAnswerDTO, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAnswerById: async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAnswersForQuestion: async (questionId, numberOfAnswers = null) => {
    try {
      const response = await axios.get(`${baseUrl}/question/${questionId}`, {
        params: {
          numberOfAnswers: numberOfAnswers,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTotalAnswersForQuestion: async (questionId) => {
    try {
      const response = await axios.get(`${baseUrl}/question/${questionId}/total`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAnswer: async (id, updateAnswerDTO) => {
    try {
      const response = await axios.put(`${baseUrl}/${id}/update`, updateAnswerDTO);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAnswer: async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}/delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AnswerApi;
