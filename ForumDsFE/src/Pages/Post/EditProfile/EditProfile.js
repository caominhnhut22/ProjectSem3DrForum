import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserApi from '../../../Api/UserApi';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService';

function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserApi.getUserById(id);
        const userData = response;

        setName(userData.name);
        setAddress(userData.address);
        setPhone(userData.phone);
        setBio(userData.bio);
        setExperience(userData.experience);
        // Không thể đặt giá trị cho avatarFile từ dữ liệu người dùng vì lý do bảo mật
      } catch (error) {
        console.error('Error fetching user details:', error);
        showErrorToast('An error occurred while fetching user details. Please try again.');
      }
    };

    fetchUserData();
  }, [id]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    console.log('AvatarFile:', file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Address', address);
      formData.append('Phone', phone);
      formData.append('Bio', bio);
      formData.append('Experience', experience);

      // Kiểm tra xem avatarFile có tồn tại không trước khi thêm để tránh vấn đề có thể xảy ra

      if (avatarFile && typeof avatarFile !== 'string' && avatarFile.size > 0) {
        // Convert the file to Blob
        const blobFile = new Blob([avatarFile], { type: avatarFile.type });
  
        // Append the Blob to FormData
        formData.append('AvatarFile', blobFile, avatarFile.name);
      }

      console.log('FormData:', formData);

      const response = await UserApi.editProfile(id, formData);

      if (response.status === 200) {
        showSuccessToast('Profile updated successfully.');
        navigate(`/personal`, { replace: true });
      } else {
        const errorMessage = response.data ? response.data.message : 'Unknown error';
        console.error('Error updating profile:', errorMessage);
        showErrorToast(`Error updating profile: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorToast('An error occurred while updating the profile. Please try again.');
    }
  };

  return (
    <section className="contact_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Edit Profile</h2>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form_container contact-form">
              <form onSubmit={handleUpdateProfile}>
                <div>
                  <input
                    className='input-login'
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
                <div>
                  <input
                    className='input-login'
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={handleAddressChange}
                  />
                </div>
                <div>
                  <input
                    className='input-login'
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                <div>
                  <textarea
                    className='input-login'
                    value={bio}
                    onChange={handleBioChange}
                    autoFocus
                    placeholder="Bio"
                  />
                </div>
                <div>
                  <input
                    className='input-login'
                    type="number"
                    placeholder="Experience"
                    value={experience}
                    onChange={handleExperienceChange}
                  />
                </div>
                <div>
                  <label>
                    Avatar File:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
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

export default EditProfile;
