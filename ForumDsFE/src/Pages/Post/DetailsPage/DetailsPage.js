import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionApi from '../../../Api/QuestionApi';
import AnswerApi from '../../../Api/AnswerApi';
import images from '../../../Images/index';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService';
import { FaComment, FaHeart, FaThumbsUp  } from 'react-icons/fa';
import './DetailsPage.css';

const DetailsPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);
  const [showDefaultAvatar, setShowDefaultAvatar] = useState(true);
  const [totalAnswers, setTotalAnswers] = useState(0); 
  const [displayedAnswers, setDisplayedAnswers] = useState(3); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionData = await QuestionApi.getQuestionById(id);
        setQuestion(questionData);
        setIsLoadingQuestion(false);
      } catch (error) {
        console.error('Error fetching question data:', error);
        setIsLoadingQuestion(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setIsLoadingAnswers(true);
        const response = await AnswerApi.getAnswersForQuestion(id, displayedAnswers);
        const answersData = response.data;
        setAnswers(answersData);
        setIsLoadingAnswers(false);
      } catch (error) {
        console.error('Error fetching answers data:', error);
        setIsLoadingAnswers(false);
      }
    };

    if (!isLoadingQuestion && question) {
      fetchAnswers();
    }
  }, [id, isLoadingQuestion, question, displayedAnswers, setIsLoadingAnswers]);

  useEffect(() => {
    const fetchTotalAnswers = async () => {
      try {
        const response = await AnswerApi.getTotalAnswersForQuestion(id);
        const totalData = response.data;
        setTotalAnswers(totalData);
      } catch (error) {
        console.error('Error fetching total answers:', error);
      }
    };

    fetchTotalAnswers();
  }, [id, totalAnswers]);

  const handleAnswerContentChange = (event) => {
    setNewAnswerContent(event.target.value);
  };

  const handleViewMore = () => {
    setDisplayedAnswers((prev) => prev + 3);
  };

  const handleAnswerSubmit = async () => {
    try {
      setIsLoadingAnswers(true);
  
      const createAnswerDTO = {
        questionId: id,
        content: newAnswerContent,
      };
  
      console.log('createAnswerDTO', createAnswerDTO);
  
      const createdAnswer = await AnswerApi.createAnswer(createAnswerDTO);
  
      console.log('createdAnswer', createdAnswer);
  
      setAnswers([createdAnswer, ...answers]);
  
      const response = await AnswerApi.getAnswersForQuestion(id);
      const updatedAnswersData = response.data;
  
      console.log('updatedAnswersData', updatedAnswersData);
        
      console.log('updatedTotalAnswersData', updatedAnswersData);
  
      setAnswers(updatedAnswersData);
      setTotalAnswers(updatedAnswersData);
  
      showSuccessToast('Answer created successfully');
  
      setNewAnswerContent('');
    } catch (error) {
      console.error('Error creating answer:', error);
      console.log('Error details:', error.response); // Log the details of the error response
      showErrorToast('Error creating answer');
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  return (
    <section>
      <div className="projcard-container">
        {isLoadingQuestion && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        
        {question && (
          <div className='details-main'>
            <img src={question.questionImage} alt=""/>
          </div>
        )}

        {question && (
          <div key={question.id} className="details-header">
            <div className="user-info">
              {question.userAvatar ? (
                <img src={question.userAvatar} alt={`Avatar of ${question.userName}`} />
              ) : (
                <img src={images.dfavatar} alt={`Avatar of ${question.userName}`} />
              )}
              <div className="user-details">
                <p className="user-name">{question.userName}</p>
                <p className="user-specialization">{question.specializationName}</p>
              </div>
            </div>
            <h1 className="details-title">{question.title}</h1>
            <p className="details-body">{question.body}</p>
            <div className="details-meta">
              <div className="meta-item-vv">
                <FaThumbsUp />  <span>{question.length} Likes</span> <br/>
              </div>
              <div className="meta-item-vv">
                <FaComment />  <span>{question.answers.length} Comments</span> <br/>
              </div>
              <div className="meta-item-vv">
                <FaHeart />  <span>{question.length} Favorites</span> <br/>
              </div>
            </div>
          </div>
        )}

        <div className="projcard-container">
          <div className="write-comment-box">
            <textarea
              className='input-login'
              autoFocus
              placeholder="Write your comment..."
              value={newAnswerContent}
              onChange={handleAnswerContentChange}
            />
            <button className='btn-comment' onClick={handleAnswerSubmit}>Submit</button>
          </div>
        </div>

        <div className="heading_container heading_center">
          <h2>Comments</h2>
        </div>

        {isLoadingAnswers && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading answers...</p>
          </div>
        )}

        {answers.length === 0 ? (
          <div className="heading_container heading_center layout_padding2">
            <h5>No comments available.</h5>
          </div>
        ) : (
          <div className="layout_padding3">
            {answers.slice(0, displayedAnswers).map((answer) => (
              <div key={answer.id} className="comment">
                {showDefaultAvatar && (
                  <img
                    src={images.dfavatar}
                    alt={`Default Avatar of ${answer.userName}`}
                    onLoad={() => setShowDefaultAvatar(false)} 
                  />
                )}

                {!showDefaultAvatar && (
                  <img src={answer.userAvatar} alt={`Avatar of ${answer.userName}`} />
                )}
                <div>
                  <p>{answer.content}</p>
                  <p>{answer.userName}</p>
                </div>
              </div>
            ))}
          </div>
        )}


        {totalAnswers > displayedAnswers && (
          <button className="btn-comment" onClick={handleViewMore}>
            View more
          </button>
        )}

      </div>
    </section>
  );
};

export default DetailsPage;
