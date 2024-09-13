import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './PersonalPage.css'; 
import UserApi from '../../../Api/UserApi';
import { jwtDecode } from 'jwt-decode';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService';

function PersonalPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
  
    useEffect(() => {
      const token = localStorage.getItem('accessToken');
  
      // If no token, redirect to login page
      if (!token) {
        navigate('/login');
        return;
      }
  
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.UserId;
  
      // Fetch user data and set it in the state
      const fetchUserData = async () => {
        try {
          const user = await UserApi.getUserById(userId);
          setUserData(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      // Call the function to fetch user data
      fetchUserData();
    }, [navigate]);
  
    const handleTabClick = (tabIndex) => {
      setActiveTab(tabIndex);
    };

    console.log("userData: ", userData);
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = userData?.questions.slice(indexOfFirstItem, indexOfLastItem);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // You can keep the handleStatusTabClick function as it is
    const handleStatusTabClick = async () => {
        try {
            // Get the token from local storage
            const token = localStorage.getItem('accessToken');

            // Decode the token to get information
            const decodedToken = jwtDecode(token);

            // Get userId from the decoded token
            const userIdCha = decodedToken.UserId;

            console.log('userId before calling changeStatus:', userIdCha);
            await UserApi.changeStatus(userIdCha);

            // Optionally: Fetch user data again after changing the status
            const updatedUser = await UserApi.getUserById(userIdCha);
            setUserData(updatedUser);

            // Log or display a success message
            console.log('User status changed successfully.');

            // Optionally: Show a success toast
            showSuccessToast('User status changed successfully.');
        } catch (error) {
            // Handle error (log, display a message, etc.)
            console.error('Error changing user status:', error);

            // Optionally: Show an error toast
            showErrorToast('Error changing user status.');
        }
    };


    const handleEditClick = (questionId) => {
      navigate(`/editpost/${questionId}`);
    };

    const handleCreatePostClick = () => {
        navigate('/createpost'); // Adjust the URL based on your routing setup
    };

    const handleEditProfileClick = () => {
        const token = localStorage.getItem('accessToken');
    
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.UserId;
          navigate(`/editprofile/${userId}`);
        } else {
          // Handle the case when there is no token
          navigate('/login');
        }
    };

    const handleChangePasswordClick = () => {
        const token = localStorage.getItem('accessToken');
    
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.UserId;
          navigate(`/changepassword/${userId}`);
        } else {
          navigate('/login');
        }
    };

    const getStatusString = (status) => {
        switch (status) {
          case 0:
            return 'Registered';
          case 1:
            return 'VerificationSent';
          case 2:
            return 'Verified';
          case 3:
            return 'Completed';
          default:
            return 'Unknown';
        }
    };

    return (

        <section className="department_section layout_padding2">
            {!userData ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
             ) : (
            <div className="container">
                <div className="profile-header">
                    <div className="profile-img">
                        <img src={userData.avatar} width="200" alt="Profile Image" />
                    </div>
                    <div className="profile-nav-info">
                        <h3 className="user-name">{userData.userName}</h3>
                        <div className="address">
                        <p id="state" className="state">{userData.address} - {userData.specialization.name}</p>
                        </div>
                    </div>
                    <div className="profile-option">
                        <div className="notification">
                            <button onClick={handleEditProfileClick} className='edit-button'>Edit Profile</button>
                        </div>
                    </div>
                </div>

                <div className="main-bd">
                    <div className="left-side">
                        <div className="profile-side">
                            <p className="mobile-no"><i className="fa fa-phone"></i> +{userData.phone}</p>
                            <p className="user-mail"><i className="fa fa-envelope"></i> {userData.email}</p>
                            <p className="user-mail">
                                <i className="fa fa-envelope"></i>
                                Profile Status: {getStatusString(userData.status)}
                            </p> 
                            <p className="user-mail">
                                <i className="fa fa-envelope"></i>
                                Account Status: {userData.isPublic ? 'Public' : 'Private'}
                            </p>
                            <div className="profile-btn">
                            <button onClick={handleChangePasswordClick} className='chatbtn'>Reset Password</button>
                            <button className="createbtn" id="Create-post" onClick={handleCreatePostClick}>
                                <i className="fa fa-plus"></i> Create
                            </button>
                            </div>
                        </div>
                    </div>

                    <div className="right-side">
                        <div className="nav">
                        <ul>
                            <li
                            className={activeTab === 0 ? 'active' : ''}
                            onClick={() => handleTabClick(0)}
                            >
                            Posts
                            </li>
                            <li
                            className={activeTab === 1 ? 'active' : ''}
                            onClick={() => handleTabClick(1)}
                            >
                            Profiles
                            </li>
                            <li
                            className={activeTab === 2 ? 'active' : ''}
                            onClick={() => handleTabClick(2)}
                            >
                            Bio
                            </li>
                        </ul>
                        </div>

                        <div className="profile-body">
                            <div className="tab" style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                                {currentItems && currentItems.length > 0 ? (
                                <ul>
                                    {currentItems.map((question) => (
                                    <li key={question.id}>
                                        <h3>{question.title}</h3>
                                        <p>{question.body}</p>
                                        {/* Nút "Edit" */}
                                        <button onClick={() => handleEditClick(question.id)} className='edit-button-post'>Edit</button>
                                    </li>
                                    ))}
                                </ul>
                                ) : (
                                <p>No posts available.</p>
                                )}
                                {/* Pagination */}
                                {userData && userData.questions.length > itemsPerPage && (
                                <div className="my-custom-pagination">
                                    {Array.from({ length: Math.ceil(userData.questions.length / itemsPerPage) }, (_, i) => (
                                    <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                                        {i + 1}
                                    </button>
                                    ))}
                                </div>
                                )}
                            </div>

                            <div className="tab" style={{ display: activeTab === 1 ? 'block' : 'none' }}>
                                {/* Content for Status tab */}
                                <h1>Status</h1>
                                <button onClick={handleStatusTabClick} className='edit-button'>Change Status</button>
                                {/* Add your status-related content here */}
                            </div>

                            <div className="tab" style={{ display: activeTab === 2 ? 'block' : 'none' }}>
                                {/* Content for Settings tab */}
                                <p className="bio">{userData.bio}</p>
                                {/* Add your settings-related content here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </section>
    );
}


export default PersonalPage;