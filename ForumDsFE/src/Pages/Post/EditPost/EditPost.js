import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionApi from '../../../Api/QuestionApi';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [questionFile, setQuestionFile] = useState(null);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await QuestionApi.getQuestionById(id);
        const questionData = response;

        setTitle(questionData.title);
        setBody(questionData.body);
        setQuestionFile(questionData.questionImage);
      } catch (error) {
        console.error('Error fetching question details:', error);
        showErrorToast('An error occurred while fetching question details. Please try again.');
      }
    };

    fetchQuestionDetails();
  }, [id]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setQuestionFile(file);
    console.log('QuestionFile:', file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Title', title);
      formData.append('Body', body);
      formData.append('IsPublic', isPublic);
  
      // Check if questionFile is truthy and not equal to the placeholder string
      if (questionFile && typeof questionFile !== 'string' && questionFile.size > 0) {
        // Convert the file to Blob
        const blobFile = new Blob([questionFile], { type: questionFile.type });
  
        // Append the Blob to FormData
        formData.append('QuestionImageFile', blobFile, questionFile.name);
      }
  
      console.log('FormData:', formData);
  
      const response = await QuestionApi.updateQuestion(id, formData);
  
      console.log("res :", response);
  
      if (response.status === 200) {
        showSuccessToast('Question updated successfully.');
        navigate(`/personal`, { replace: true });
      } else {
        const errorMessage = response.data ? response.data.message : 'Unknown error';
        console.error('Error updating question:', errorMessage);
        showErrorToast(`Error updating question: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error updating question:', error);
      showErrorToast('An error occurred while updating the question. Please try again.');
    }
  };

  return (
    <section className="contact_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Edit Post</h2>
        </div>
        <div className="row">
            <div className="col-md-12">
                <div className="form_container contact-form">
                    <form onSubmit={handleUpdate}>
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
                                value={body}
                                onChange={handleBodyChange}
                                autoFocus
                                placeholder="Enter content ..."
                            />
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
                        <div>
                            <label>
                                Question Image:
                                <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        <hr className="post-hrs" />
                        <div className="button-post">
                        <button
                            className="bt-post-cancel"
                            onClick={() => {
                            navigate(`/personal`, { replace: true });
                            }}
                        >
                            Cancel
                        </button>
                        <button className="bt-post" type="submit">
                            Update
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

export default EditPost;
