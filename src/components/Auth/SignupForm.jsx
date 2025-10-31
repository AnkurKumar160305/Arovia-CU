import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

function SignupForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    age: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login } = useAuth();
  const { t } = useLanguage();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSendOTP = async () => {
    if (!formData.name || !formData.mobile || !formData.age) {
      setError('Please fill in all fields before sending OTP');
      return;
    }

    if (formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (formData.age < 1 || formData.age > 120) {
      setError('Please enter a valid age between 1 and 120');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-otp', {
        mobile: `+91${formData.mobile}`
      });

      if (response.data.success) {
        setOtpSent(true);
        setSuccess('OTP sent successfully! Use 2004 for testing.');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.age || !formData.otp) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get user location if available
      let location = {};
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (error) {
          console.log('Location access denied');
        }
      }

      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        mobile: `+91${formData.mobile}`,
        age: parseInt(formData.age),
        otp: formData.otp,
        location
      });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        onClose();
        window.location.href = '/v1/userDashboard';
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">{t('name')}</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          className="form-input"
          disabled={otpSent}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('mobile_number')}</label>
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
            disabled={otpSent}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('age')}</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          placeholder="Enter your age"
          className="form-input"
          min="1"
          max="120"
          disabled={otpSent}
        />
      </div>

      {!otpSent ? (
        <button
          type="button"
          onClick={handleSendOTP}
          disabled={loading || !formData.name || !formData.mobile || !formData.age}
          className="send-otp-btn"
        >
          {loading ? 'Sending...' : t('send_otp')}
        </button>
      ) : (
        <div className="otp-section">
          <div className="form-group">
            <label className="form-label">{t('enter_otp')}</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              placeholder="Enter 4-digit OTP"
              className="form-input"
              maxLength="4"
              pattern="[0-9]{4}"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !formData.otp}
            className="auth-submit-btn"
          >
            {loading ? 'Verifying...' : t('verify_signup')}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </form>
  );
}

export default SignupForm;