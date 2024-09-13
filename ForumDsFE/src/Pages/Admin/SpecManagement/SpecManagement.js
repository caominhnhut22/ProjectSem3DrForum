import React, { useEffect, useState } from 'react';
import SpecilizationApi from '../../../Api/SpecilizationApi';
import { Link } from 'react-router-dom';

function SpecManagement({ setIsNavbarVisible, setIsFooterVisible }) {
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    setIsNavbarVisible(false);
    setIsFooterVisible(false);
    loadSpecializations();
  }, [setIsNavbarVisible, setIsFooterVisible]);

  const loadSpecializations = async () => {
    try {
      const data = await SpecilizationApi.getAllSpecializations();
      setSpecializations(data);
    } catch (error) {
      console.error('Error loading specializations:', error);
    }
  };

  return (
    <div className="home-flex-container">
      <div className="home-post">
        <div>
          <hr className="home-hr" />
          <Link to="/admin/speccreate" className="btn-joinus">
            Create
          </Link>
        </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {specializations.map((spec) => (
              <tr key={spec.id}>
                <td>{spec.name}</td>
                <td>{spec.description}</td>
                <td>
                  <Link
                    to={`/admin/specedit/${spec.id}`}
                    className="btn-joinus"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpecManagement;
