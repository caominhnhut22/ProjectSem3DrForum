import React, { useState } from 'react';
import SpecilizationApi from '../../../Api/SpecilizationApi';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService'; 
import { useNavigate } from 'react-router-dom';

function SpecCreate(props) {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
  
    try {
      await SpecilizationApi.createSpecialization(formData); // Pass formData
      showSuccessToast('Specialization created successfully!');
      navigate('/admin/specmanage');
    } catch (error) {
      console.error('Error creating specialization:', error);
      showErrorToast('Error creating specialization. Please try again.');
    }
  };
  
  

  return (
    <section className="contact_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Create Specialization</h2>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form_container contact-form">
              <form onSubmit={handleCreate}>
                <div className="form-row">
                  <div className="col-lg-12">
                    <div>
                      <label>Name:</label>
                      <input
                        type="text"
                        placeholder="Enter Name..."
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label>Description:</label>
                      <textarea
                        className='input-login'
                        autoFocus
                        placeholder="Enter Description..."
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="btn_box">
                  <button type="submit">
                    CREATE
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

export default SpecCreate;
