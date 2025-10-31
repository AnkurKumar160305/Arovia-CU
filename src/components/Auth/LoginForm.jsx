import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

function LoginForm({ onClose }) {
  const [formData, setFormData] = useState({
    mobile: '',
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
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
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
    
    if (!formData.mobile || !formData.otp) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        mobile: `+91${formData.mobile}`,
        otp: formData.otp
      });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        onClose();
        
        // Redirect based on role
        const role = response.data.user.role;
        if (role === 'doctor') {
          window.location.href = '/v1/doctorDashboard';
        } else if (role === 'admin') {
          window.location.href = '/v1/adminDashboard';
        } else {
          window.location.href = '/v1/userDashboard';
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
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

      {!otpSent ? (
        <button
          type="button"
          onClick={handleSendOTP}
          disabled={loading || !formData.mobile}
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
            {loading ? 'Verifying...' : t('verify_login')}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </form>
  );
}

export default LoginForm;