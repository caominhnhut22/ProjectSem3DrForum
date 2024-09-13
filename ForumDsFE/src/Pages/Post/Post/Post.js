import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuestionApi from '../../../Api/QuestionApi';
import SpecilizationApi from '../../../Api/SpecilizationApi';
import Pagination from '../../../Components/Pagination/Pagination';
import { FaComment, FaHeart, FaThumbsUp  } from 'react-icons/fa';
import './Post.css';

function Post({ setIsNavbarVisible }) {
  const [questions, setQuestions] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = async (specializationId, page, pageSize) => {
    console.log("Fetching data with specializationId:", specializationId, "currentPage:", page);
    try {
      setIsLoading(true);
      const questionsData = await QuestionApi.getQuestionsBySpecializationId(specializationId, page, pageSize);
      setQuestions(questionsData);
      setSelectedSpecializationId(specializationId);
      setTotalQuestions(await QuestionApi.getTotalQuestionsBySpecializationId(specializationId));
      setNotFound(questionsData.length === 0);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const specializationsData = await SpecilizationApi.getAllSpecializations();
      setSpecializations(specializationsData);
    } catch (error) {
      console.error('Error fetching specializations from API:', error);
    }
  };

  useEffect(() => {
    if (!isFiltering) {
      fetchData(selectedSpecializationId, currentPage, pageSize);
    }
    setIsFiltering(false);
    fetchSpecializations();
    setIsNavbarVisible(true);
    window.scrollTo(0, 0);
  }, [selectedSpecializationId, currentPage, pageSize]);
    
  const handleSpecializationClick = (specializationId) => {
    if (specializationId !== selectedSpecializationId) {
      setCurrentPage(1);
      fetchData(specializationId, 1, pageSize);
      setIsFiltering(true);
    }
  };

  const truncateTitle = (body, maxLength) => {
    if (body.length > maxLength) {
      return body.substring(0, maxLength) + '...';
    }
    return body;
  };
  
  const truncateBody = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <section className='post-sec'>
      <div className="projcard-container">
        <div className="heading_container heading_center">
          <h2>Post</h2>
        </div>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : notFound ? (
          <div className="not-found">No questions found</div>
        ) : questions && questions.length ? (
          questions.map((question) => (
            <div key={question.id} className={`projcard projcard-blue ${selectedSpecializationId === question.specializationId ? 'selected' : ''}`}>
              <div className="projcard-innerbox">
                <div className="projcard-textbox" style={{ width: '100%' }}>
                  <div className="projcard-title">
                    <Link to={`/details/${question.id}`} className="box">
                      <a>
                      {truncateTitle(question.title, 80)}
                      </a>
                    </Link>
                  </div>
                  <div className="projcard-subtitle">{truncateBody(question.body, 100)}</div>
                  <div className="projcard-bar"></div>
                  <div className="projcard-description">
                    {question.userName} - {formatDate(question.createdAt)}
                  </div>
                  <div className="projcard-tagbox">
                    <span className="projcard-tag">{question.specializationName}</span>
                  </div>
                  <div className="projcard-icons">
                    <FaComment /> {question.answers.length} <span>Comments</span> <br/>
                    <FaHeart /> {question.isFavorite} <span>Favorites</span> <br/>
                    <FaThumbsUp /> {question.likeCount} <span>Likes</span> 
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="not-found">No questions found</div>
        )}
      </div>

      <div className='filter-spec'>
        <Link to={`/createpost`} className="box">
          CREATE POST
        </Link>
        <div className='header-spec'>Filter Options</div>
        <div className='body-spec'>
          {specializations.map((specialization) => (
            <label key={specialization.id} onClick={() => handleSpecializationClick(specialization.id)}>
              <input type='radio' name='selectedSpecialization' checked={selectedSpecializationId === specialization.id} readOnly />
              {specialization.name}
            </label>
          ))}
        </div>
      </div>
      <div className='pagination-container'>
        {totalQuestions !== undefined && (
          <Pagination
            totalQuestions={totalQuestions}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </section>
  );
}

export default Post;
