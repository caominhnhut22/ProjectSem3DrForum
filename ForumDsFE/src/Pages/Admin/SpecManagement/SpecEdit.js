import React, { useState, useEffect } from 'react';
import SpecilizationApi from '../../../Api/SpecilizationApi';
import { showSuccessToast, showErrorToast } from '../../../Services/ToastService'; 
import { useNavigate, useParams } from 'react-router-dom';

function SpecEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    const loadSpecialization = async () => {
      try {
        const specialization = await SpecilizationApi.getSpecializationById(id);
        setFormData({
          name: specialization.name,
          description: specialization.description,
        });
      } catch (error) {
        console.error('Error loading specialization:', error);
        // Handle error (e.g., redirect to an error page)
      }
    };

    loadSpecialization();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      await SpecilizationApi.updateSpecialization(id, formData); // Pass formData
      showSuccessToast('Specialization updated successfully!');
      navigate('/admin/specmanage');
    } catch (error) {
      console.error('Error updating specialization:', error);
      showErrorToast('Error updating specialization. Please try again.');
    }
  };

  return (
    <section className="contact_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Edit Specialization</h2>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form_container contact-form">
              <form onSubmit={handleUpdate}>
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
                    UPDATE
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

export default SpecEdit;
