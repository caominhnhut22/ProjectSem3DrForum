import React, { useEffect, useState } from 'react';
import QuestionApi from '../../../Api/QuestionApi';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService'; 

function PostManagement({ setIsNavbarVisible, setIsFooterVisible }) {
    const [questions, setUnacceptedQuestions] = useState([]);

    useEffect(() => {
      setIsNavbarVisible(false);
      setIsFooterVisible(false);
  
      const fetchUnacceptedQuestions = async () => {
        try {
          const unacceptedQuestionsData = await QuestionApi.getAllUnacceptedQuestions();
          setUnacceptedQuestions(unacceptedQuestionsData);
        } catch (error) {
          console.error('Error fetching unaccepted questions from API:', error);
        }
      };
  
      fetchUnacceptedQuestions();
    }, [setIsNavbarVisible, setIsFooterVisible]);
  
    const handleAccept = async (questionId) => {
      try {
        await QuestionApi.changeIsAccepted(questionId, { isAccepted: true });
        const updatedQuestions = await QuestionApi.getAllUnacceptedQuestions();
        setUnacceptedQuestions(updatedQuestions);
        showSuccessToast('Question accepted successfully!');
      } catch (error) {
        console.error('Error accepting question:', error);
        showErrorToast('Failed to accept question. Please try again.');
      }
    };
  
    const handleReject = async (questionId) => {
      try {
        await QuestionApi.changeIsAccepted(questionId, { isAccepted: false });
        const updatedQuestions = await QuestionApi.getAllUnacceptedQuestions();
        setUnacceptedQuestions(updatedQuestions);
        showSuccessToast('Question rejected successfully!');
      } catch (error) {
        console.error('Error rejecting question:', error);
        showErrorToast('Failed to reject question. Please try again.');
      }
    };
  return (
    <div className="home-flex-container">
      <div className="home-post">
        <table className="user-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Body</th>
              <th>Public</th>
              <th>Image</th>
              <th>User Name</th>
              <th>Avatar</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id}>
                <td>{question.title}</td>
                <td>{question.body}</td>
                <td>{question.isPublic ? 'Yes' : 'No'}</td>
                <td>
                  <img src={question.questionImage} alt="Question" style={{ width: '50px', height: '50px' }} />
                </td>
                <td>{question.userName}</td>
                <td>
                  <img src={question.userAvatar} alt="User Avatar" style={{ width: '50px', height: '50px' }} />
                </td>
                <td>{question.specializationName}</td>
                <td>
                  <button onClick={() => handleAccept(question.id)} className="btn-joinus">
                    Accept
                  </button>
                  <span>..</span>
                  <button onClick={() => handleReject(question.id)} className="btn-joinus">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostManagement;
