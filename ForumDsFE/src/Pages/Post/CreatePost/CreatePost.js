import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import QuestionApi from '../../../Api/QuestionApi';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService';
import './CreatePost.css';

function CreatePost() {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [specializationId, setSpecializationId] = useState(null);
  const [questionFile, setQuestionFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userSpecializationId = decodedToken['Specialization_id'];
      const cuserId = decodedToken['UserId'];
      setSpecializationId(userSpecializationId);
      setUserId(cuserId);
    }
  }, [userId, specializationId]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      if (!specializationId) {
        console.error('No SpecializationId for the user.');
        return;
      }

      const isAuthenticated = true;
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('Title', title);
      formData.append('Body', content);
      formData.append('IsPublic', isPublic);
      formData.append('UserId', userId);
      formData.append('SpecializationId', specializationId);
      formData.append('QuestionImageFile', questionFile);

      console.log("formData :", formData);

      const response = await QuestionApi.createQuestion(formData);

      showSuccessToast('Question created successfully.');

      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error creating question:', error);
      showErrorToast('An error occurred while creating the question. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    setQuestionFile(e.target.files[0]);
  };

  return (
    <section className="contact_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Create a post</h2>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form_container contact-form">
              <form onSubmit={handlePost}>
                <div>
                  <input
                    className='input-login'
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>
                <div>
                  <textarea
                    className='input-login'
                    value={content}
                    onChange={handleContentChange}
                    autoFocus
                    placeholder="Enter content ..."
                  />
                </div>
                <div>
                  <label>
                    Question Image:
                    <input
                      className='input-create-account'
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <div className="create-post-options">
                  <label>
                    IsPublic:
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                    />
                  </label>
                </div>
                <hr className="post-hrs" />
                <div className="button-post">
                  <button
                    className="bt-post-cancel"
                    onClick={() => {
                      navigate('/', { replace: true });
                    }}
                  >
                    Cancel
                  </button>
                  <button className="bt-post" type="submit">
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreatePost;
