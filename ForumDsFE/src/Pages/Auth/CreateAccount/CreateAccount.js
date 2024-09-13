import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService'; // Update the path accordingly
import './CreateAccount.css';
import UserApi from '../../../Api/UserApi';
import SpecilizationApi from '../../../Api/SpecilizationApi';

function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specializationId, setSpecializationId] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  const [specializations, setSpecializations] = useState([]);
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(true);
  const [isLoadingCreateAccount, setIsLoadingCreateAccount] = useState(false);

  useEffect(() => {
    const specializationIdFromState = location.state?.specializationId;

    if (specializationIdFromState) {
      setSpecializationId(specializationIdFromState);
    }

    // Fetch specializations (assuming you have an API call for fetching specializations)
    const fetchSpecializations = async () => {
      try {
        const response = await SpecilizationApi.getAllSpecializations();
        setSpecializations(response);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      } finally {
        setIsLoadingSpecializations(false);
      }
    };

    fetchSpecializations();
  }, [location.state]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoadingCreateAccount(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('specialization_id', specializationId);
      formData.append('avatarFile', avatarFile);

      const response = await UserApi.register(formData);

      if (!response.success) {
        // Show success toast
        showSuccessToast('Registration successful!');
        // Navigate to the VerifyEmail page
        navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true });
        // navigate(`/verify-email`, { replace: true });
      } else {
        // Show error toast
        showErrorToast(`Registration failed: ${response.message}`);
      }
    } catch (error) {
      // Show error toast
      showErrorToast(`Error during registration: ${error.message}`);
    } finally {
      setIsLoadingCreateAccount(false);
    }
  };

  return (
    <section className="contact_section layout_padding">
      <div className='container'>
        <div className="heading_container">
          <h2>REGISTER</h2>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='form_container contact-form'>
              {isLoadingSpecializations ? (
                // Show loading spinner for fetching specializations
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading specializations...</p>
                </div>
              ) : (
                // Show register form
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div>
                    <input
                      className='input-create-account'
                      type='text'
                      name='name'
                      placeholder='Enter full name...'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className='input-create-account'
                      type='email'
                      name='email'
                      placeholder='Enter email...'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <select
                      className='select-create-account'
                      name='specialization_id'
                      value={specializationId}
                      onChange={(e) => setSpecializationId(e.target.value)}
                    >
                      <option value='' disabled>Select specialization...</option>
                      {specializations.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      className='input-create-account'
                      type='password'
                      name='password'
                      placeholder='Enter password...'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className='input-create-account'
                      type='file'
                      name='avatarFile'
                      accept='image/*'
                      onChange={(e) => setAvatarFile(e.target.files[0])}
                    />
                  </div>
                  <button type='submit' className='bt-submit-create-account'>
                    {isLoadingCreateAccount ? 'Creating Account...' : 'Submit'}
                  </button>
                </form>
              )}
            </div>
            <div>
              Already have an account ?<Link className='forgot-password' to='/login'> Back to login page</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
  
}

export default CreateAccount;