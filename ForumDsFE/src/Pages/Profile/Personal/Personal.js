import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Personal.css';
import userApi from '../../../Api/UserApi'; // Assuming correct path
import { AiFillHeart } from 'react-icons/ai';

function Personal() {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleButtonClick = () => {
    setIsFollowing((prev) => !prev);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await userApi.getUserById();
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); 

  return (
    <div className="personal-flex-container">
      {/* ... Existing JSX ... */}
      <div className="form-personal">
        <div className="personal">
          {/* ... Existing JSX ... */}
          {userData && (
            <>
              <div className="personal-informations">
                <img
                  className="img-personal-page"
                  src={userData.avatar} // Replace 'avatar' with the actual property in your user data
                  alt="Avatar"
                />
              </div>

              <div className="personal-informations">
                <h2>{userData.name}</h2> {/* Replace 'name' with the actual property in your user data */}
              </div>

              <div>
                <p className="major">{userData.major}</p> {/* Replace 'major' with the actual property in your user data */}
              </div>

              {/* ... Other user information rendering ... */}
            </>
          )}

          <div className="upload">
            <button
              className={`bt-follow ${isFollowing ? 'following' : ''}`}
              onClick={handleButtonClick}
            >
              {isFollowing ? 'The Following' : 'Follow'}
            </button>
          </div>

          <div className="form-post">
            {/* ... Existing JSX ... */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personal;
