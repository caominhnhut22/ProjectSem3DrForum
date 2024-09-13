import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SpecilizationApi from '../../../Api/SpecilizationApi';
import UserApi from '../../../Api/UserApi';
import './SpecDetails.css';

const SpecDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use the useNavigate hook for navigation
  const [specializationDetails, setSpecializationDetails] = useState({});
  const [specializationUsers, setSpecializationUsers] = useState([]);

  useEffect(() => {
    const fetchSpecializationDetails = async () => {
      try {
        const response = await SpecilizationApi.getSpecializationById(id);
        setSpecializationDetails(response);
      } catch (error) {
        console.error('Error fetching specialization details:', error);
      }
    };

    const fetchSpecializationUsers = async () => {
      try {
        const usersResponse = await UserApi.getSpecializationUsers(id);
        setSpecializationUsers(usersResponse);
      } catch (error) {
        console.error('Error fetching specialization users:', error);
      }
    };

    fetchSpecializationDetails();
    fetchSpecializationUsers();
  }, [id]);

  const handleJoinUs = () => {
    // Navigate to the CreateAccount page with the specialization information
    navigate('/createaccount', { state: { specializationId: id } });
  };

  return (
    <section className="about_section layout_margin-bottom">
        <div className="container">
          <div className="heading_container heading_center">
            <div className="column-container">
              <div className="column">
                <h2>{specializationDetails.name}</h2>
                <p>{specializationDetails.description}</p>
                <div className="btn-box">
                  <button onClick={handleJoinUs} className="btn-joinus">
                    Join Us
                  </button>
                </div>
                <Link to="/specializations">Back to Specializations</Link>
                <div className='layout_padding2'>
                  <div className="row">
                    <div className="col-md-6">
                        <h2>
                          MEMBER &<span> POST</span>
                        </h2>
                      <div className="img-box">
                      <table className="user-table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {specializationUsers.map((user) => (
                                <tr key={user.id}>
                                  <td>{user.id}</td>
                                  <td>{user.name}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h2>
                        USER <span>LIST</span>
                      </h2>
                      <div className="img-box">
                          <table className="user-table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {specializationUsers.map((user) => (
                                <tr key={user.id}>
                                  <td>{user.id}</td>
                                  <td>{user.name}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default SpecDetails;
