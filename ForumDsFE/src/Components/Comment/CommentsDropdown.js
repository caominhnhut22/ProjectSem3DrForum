import React, { useState, useEffect } from 'react';
import AnswerApi from '../../Api/AnswerApi';

const CommentsDropdown = ({ questionId }) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await AnswerApi.getAnswersForQuestion(questionId);
        setAnswers(response.data);
      } catch (error) {
        console.error('Error fetching answers:', error);
      }
    };

    // Check if questionId is defined before making the API request
    if (questionId) {
      fetchAnswers();
    }
  }, [questionId]);

  return (
    <div>
      {/* <h2>Answers for Question {questionId}</h2> */}
      <ul>
        {answers.map((answer) => (
          <li key={answer.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={`URL_TO_YOUR_AVATAR_ENDPOINT/${answer.userId}`} 
                alt="Avatar"
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
              />
              <div>
                <p>{answer.userName} - {answer.createdAt}</p>
              </div>
            </div>
            <p>Comments: {answer.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentsDropdown;
