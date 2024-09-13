import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthApi from '../../../Api/AuthApi';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService'; 
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../../Contexts/AuthProvider';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const preFilledEmail = location.state?.preFilledEmail;
    if (preFilledEmail) {
      setEmail(preFilledEmail);
    }
  }, [location.state]);
  
  const handleLogin = async (loginData) => {
    try {
      setIsLoading(true);
      const response = await AuthApi.login(loginData);
      localStorage.setItem('accessToken', response.token);
      console.log('Login successful. Token:', response.token);

      const decodedToken = jwtDecode(response.token);
      const role = decodedToken['Role'];

      if (role === 'Admin') {
        showSuccessToast('Login successful!');
        login(decodedToken); // Use the login function from useAuth
        navigate('/admin', { replace: true });
      } else {
        showErrorToast('User not found.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error logging in:', error.response.data);
        showErrorToast('Invalid email or password. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        showErrorToast('No response received from the server.');
      } else {
        console.error('Request setup error:', error.message);
        showErrorToast('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="contact_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>
            LOGIN ADMIN
          </h2>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form_container contact-form">
              {isLoading ? (
                // Show loading spinner
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading...</p>
                </div>
              ) : (
                // Show login form
                <form onSubmit={(e) => { e.preventDefault(); handleLogin({ email, password }); }}>
                  <div>
                    <input
                      className='input-login'
                      type="text"
                      placeholder="Enter email ..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className='input-login'
                      type="password"
                      placeholder="Enter password ..."
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="btn_box">
                    <button>
                      SUBMIT
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="map_container">
              <div className="map">
                <div className="map_content">
                  <h3>Join Our Medical Forum</h3>
                  <p>Explore a community of dedicated doctors sharing knowledge, insights, and experiences. Join our medical forum to collaborate and learn together.</p>
                  <div>
                    <Link className='back-to-homepage' to='/'> Back To Homepage </Link> -
                    <Link className='back-to-homepage' to='/login'> Login Page </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;
