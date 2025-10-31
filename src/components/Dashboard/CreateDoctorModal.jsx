import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

function CreateDoctorModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    age: '',
    speciality: '',
    experience: '',
    qualifications: '',
    languages: '',
    consultationFee: '',
    location: '',
    image: '',
    about: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useLanguage();

  const specialities = [
    'Cardiologist',
    'Gynecologist', 
    'Orthopedic',
    'Pediatrician',
    'Neurologist',
    'Dermatologist',
    'Dentist',
    'General Medicine',
    'Psychiatrist',
    'Pulmonologist'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.mobile || !formData.age || !formData.speciality) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create doctor account
      const doctorData = {
        name: formData.name,
        mobile: `+91${formData.mobile}`,
        age: parseInt(formData.age),
        role: 'doctor',
        speciality: formData.speciality,
        experience: parseInt(formData.experience) || 0,
        qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q),
        languages: formData.languages.split(',').map(l => l.trim()).filter(l => l),
        consultationFee: parseInt(formData.consultationFee) || 500,
        location: formData.location,
        image: formData.image || 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
        about: formData.about,
        availability: 'Available Today',
        rating: 4.5,
        reviews: 0
      };

      // In a real application, you would send this to your backend
      console.log('Creating doctor:', doctorData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Doctor account created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        age: '',
        speciality: '',
        experience: '',
        qualifications: '',
        languages: '',
        consultationFee: '',
        location: '',
        image: '',
        about: ''
      });

      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setError('Failed to create doctor account');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-doctor-modal-overlay">
      <div className="create-doctor-modal">
        <div className="create-doctor-modal-header">
          <h3>Create Doctor Account</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="create-doctor-modal-content">
          <form className="create-doctor-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Doctor Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter doctor's full name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <div className="mobile-input-group">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    className="form-input"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  className="form-input"
                  min="25"
                  max="80"
                  required
                />
              </div>

              <div className="form-group">
                <label>Speciality *</label>
                <select
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Speciality</option>
                  {specialities.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Years of experience"
                  className="form-input"
                  min="0"
                  max="50"
                />
              </div>

              <div className="form-group">
                <label>Consultation Fee (₹)</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  placeholder="Consultation fee"
                  className="form-input"
                  min="100"
                  max="5000"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Qualifications</label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                placeholder="MBBS, MD, etc. (comma separated)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Languages</label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                placeholder="English, Hindi, etc. (comma separated)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Location/Hospital</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Hospital/Clinic name and location"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/doctor-image.jpg"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>About Doctor</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Brief description about the doctor"
                className="form-textarea"
                rows="3"
              ></textarea>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="confirm-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Doctor Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateDoctorModal;