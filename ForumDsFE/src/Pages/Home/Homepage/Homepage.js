import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Homepage.css';
import './bootstrap.css';
import images from '../../../Images/index';
import SpecilizationApi from '../../../Api/SpecilizationApi';
import UserApi from '../../../Api/UserApi';
import AuthApi from '../../../Api/AuthApi';
import { useAuth } from '../../../Contexts/AuthProvider';

function Homepage({ setIsNavbarVisible }) {
  const [specializations, setSpecializations] = useState([]);
  const [loggedInUsersCount, setLoggedInUsersCount] = useState(0);
  const [statistics, setStatistics] = useState({ totalMembers: 0, totalUsers: 0 });
  const { isLoggedIn, login, logout } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await SpecilizationApi.getSpecializations(4);
        setSpecializations(response);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    const fetchDataCount = async () => {
      try {
        const loggedInUsersResponse = await AuthApi.getLoggedInUsersCount();
        setLoggedInUsersCount(loggedInUsersResponse.loggedInUsersCount);

        const statisticsResponse = await UserApi.getStatistics();
        setStatistics(statisticsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchSpecializations();
    fetchDataCount();
  }, [isLoggedIn]); 

  setIsNavbarVisible(true);

  return (
    <div>
      <section className="about_section layout_margin-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="img-box">
                <img src={images.about} alt="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-box">
                <div className="heading_container">
                  <h2>
                    Doctors <span>Forum</span>
                  </h2>
                </div>
                <p>
                  Welcome to the Doctors Forum, a vibrant community where medical professionals come together to exchange knowledge, insights, and experiences. Our forum is a hub for collaborative learning, allowing doctors to engage in discussions, share expertise, and accumulate valuable practical wisdom. Join us in fostering a culture of continuous learning and professional development within the medical community.
                </p>
                <div className="info-box">
                  <p>
                    <strong>Join our community:</strong>
                    <br />
                    Total Members: {statistics.totalMembers}
                    <br />
                    Currently Online: {loggedInUsersCount}
                  </p>
                </div>
                <a href="#">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="department_section layout_padding">
        <div className="department_container">
          <div className="container">
            <div className="heading_container heading_center">
              <h2>Our Specializations</h2>
              <p>
                Asperiores sunt consectetur impedit nulla molestiae delectus repellat laborum dolores doloremque accusantium
              </p>
            </div>
            <div className="row">
              {specializations.map((spec, index) => (
                <div className="col-md-3" key={index}>
                  <Link to={`/specdetails/${spec.id}`} className="box">
                    <div className="img-box">
                      <img
                        src={images.s4}
                        alt={`Image for ${spec.name}`}
                        onMouseOver={(e) => (e.currentTarget.src = images.s3)}
                        onMouseOut={(e) => (e.currentTarget.src = images.s4)}
                      />
                    </div>
                    <div className="detail-box">
                      <h5>{spec.name}</h5>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="doctor_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Our Members
            </h2>
            <p className="col-md-10 mx-auto px-0">
              Incilint sapiente illo quo praesentium officiis laudantium nostrum, ad adipisci cupiditate sit, quisquam aliquid. Officiis laudantium fuga ad voluptas aspernatur error fugiat quos facilis saepe quas fugit, beatae id quisquam.
            </p>
          </div>
          <div className="row">
            <div className="col-sm-6 col-lg-4 mx-auto">
              <div className="box">
                <div className="img-box">
                  <img src={images.d2} alt=""/>
                </div>
                <div className="detail-box">
                  <h5>
                    Nguyen Hoang Minh
                  </h5>
                  <h6 className="">
                    Member
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4 mx-auto">
              <div className="box">
                <div className="img-box">
                  <img src={images.d2} alt=""/>
                </div>
                <div className="detail-box">
                  <h5>
                    Nguyen Anh Khoa
                  </h5>
                  <h6 className="">
                    Member
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4 mx-auto">
              <div className="box">
                <div className="img-box">
                  <img src={images.d2} alt=""/>
                </div>
                <div className="detail-box">
                  <h5>
                    Cao Minh Nhut
                  </h5>
                  <h6 className="">
                    Member
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-box">
            <a href="">
              View All
            </a>
          </div>
        </div>
      </section>

      <section className="contact_section layout_padding">
        <div className="container">
          <div className="heading_container">
            <h2>
              Get In Touch
            </h2>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form_container contact-form">
                <form action="">
                  <div className="form-row">
                    <div className="col-lg-6">
                      <div>
                        <input type="text" placeholder="Your Name" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div>
                        <input type="text" placeholder="Phone Number" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <input type="email" placeholder="Email" />
                  </div>
                  <div>
                    <input type="text" className="message-box" placeholder="Message" />
                  </div>
                  <div className="btn_box">
                    <button>
                      SEND
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <div className="map_container">
                <div className="map">
                  <div id="googleMap"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
