import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Specializations.css';
import images from '../../../Images/index';
import SpecilizationApi from '../../../Api/SpecilizationApi';

function Specializations({ setIsNavbarVisible }) {
  const [specializations, setSpecializations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // Thêm state cho trạng thái loading

  const fetchSpecializations = async (maxCount) => {
    try {
      setIsLoading(true);
      const response = await SpecilizationApi.getSpecializations(maxCount);
      setSpecializations(response);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecializations(4);
    setIsNavbarVisible(true);
  }, []); 

  const handleViewAll = async () => {
    try {
      setLoadingMore(true); // Bắt đầu loading
      const response = await SpecilizationApi.getSpecializations(); 
      setSpecializations(response);
      setShowAll(true);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    } finally {
      setLoadingMore(false); // Kết thúc loading
    }
  };
  
  return (
    <div>
      <section className="department_section layout_padding">
        <div className="department_container">
          <div className="container">
            <div className="heading_container heading_center">
              <h2>Our Specializations</h2>
              <p>
                Asperiores sunt consectetur impedit nulla molestiae delectus repellat laborum dolores doloremque accusantium
              </p>
            </div>
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            ) : (
              <div className="row">
                {specializations.slice(0, showAll ? undefined : 4).map((spec, index) => (
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
            )}
            {!showAll && (
              <div className="btn-box">
                <Link
                  onClick={handleViewAll}
                >
                  {loadingMore ? 'Loading...' : 'View All'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Specializations;
