import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserApi from '../../../Api/UserApi';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService'; 

function ChangePassword() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      const response = await UserApi.changePassword(userId, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
  
      // Handle success
      showSuccessToast(response.message);
    } catch (error) {
      // Handle error
      const errorCode = error.response?.data.errorCode;
  
      if (errorCode === "InvalidCurrentPassword") {
        showErrorToast("Current password is incorrect");
      } else if (errorCode === "PasswordMismatch") {
        showErrorToast("New password and confirmation do not match");
      } else {
        showErrorToast("An error occurred");
      }
    }
  };

  return (
    <section className="contact_section layout_padding">
        <div className="container">
            <div className="heading_container">
                <h2>Change Password</h2>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="form_container contact-form">
                        <form onSubmit={handleChangePassword}>
                            <div>
                                <label htmlFor="currentPassword">Current Password:</label>
                                <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword">New Password:</label>
                                <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword">Confirm Password:</label>
                                <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
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
                                Change Password
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

export default ChangePassword;
