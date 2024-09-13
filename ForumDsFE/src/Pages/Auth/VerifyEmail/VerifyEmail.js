import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import UserApi from '../../../Api/UserApi';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService';

function VerifyEmail({ setIsNavbarVisible }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  const { email: encodedEmail } = useParams();
  const email = decodeURIComponent(encodedEmail);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    emailRef.current = email;
    console.log('email useEffect: ', email);
  }, [location]);

  useEffect(() => {
    setIsNavbarVisible(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Access email from the ref
      const email = emailRef.current;

      console.log('Email before API call: ', email);
      await UserApi.verifyEmail({ email, verificationCode });

      showSuccessToast('Email verified successfully!');
      navigate('/verification-success');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log("email404: ", email);
          showErrorToast('User not found. Please check your email.');
        } else if (error.response.status === 400) {
          console.log("email400: ", email);
          showErrorToast('Invalid verification code. Please try again.');

          if (error.response.data && error.response.data.message) {
            const errorMessage = error.response.data.message;

            // Check if errorMessage is defined before calling includes
            if (errorMessage && errorMessage.includes) {
              console.log("emailexpired: ", email);
              showErrorToast('Verification code has expired. Please check your email for a new code.');
            }
          }
        } else if (error.response.status === 500) {
          showErrorToast('Internal server error. Please try again later.');
        } else {
          showErrorToast('An error occurred. Please try again.');
        }
      } else {
        showErrorToast('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='contact_section layout_padding'>
      <div className='container'>
        <div className="heading_container">
          <h2>VERIFY EMAIL</h2>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='form_container contact-form'>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <form onSubmit={handleSubmit} className="verify-email-form">
                <label>
                  Verification Code: 
                  <input
                    type="text"
                    placeholder='Enter verification code...'
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </label>
                <button type="submit" disabled={isLoading}>
                  Verify
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerifyEmail;
