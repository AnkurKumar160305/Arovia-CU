import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

function AppointmentModal({ doctor, isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  // Generate available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  // Available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert(t('please_login_to_book') || 'Please login to book an appointment');
      return;
    }

    if (!selectedDate || !selectedTime || !patientName || !patientAge) {
      alert(t('please_fill_required_fields') || 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const message = t('appointment_booked_success') 
        ? `${t('appointment_booked_success')} ${doctor.name} ${t('on')} ${selectedDate} ${t('at')} ${selectedTime}`
        : `Appointment booked successfully with ${doctor.name} on ${selectedDate} at ${selectedTime}`;
      alert(message);
      setLoading(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="appointment-modal-overlay">
      <div className="appointment-modal">
        <div className="appointment-modal-header">
          <h3>{t('book_appointment')}</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="doctor-summary">
          <img src={doctor.image} alt={doctor.name} className="doctor-avatar" />
          <div className="doctor-summary-info">
            <h4>{doctor.name}</h4>
            <p>{doctor.speciality}</p>
            <p className="consultation-fee">{t('consultation_fee')}: ₹{doctor.consultationFee}</p>
          </div>
        </div>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('select_date') || 'Select Date'} *</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-select"
                required
              >
                <option value="">{t('choose_date') || 'Choose Date'}</option>
                {getAvailableDates().map(date => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('select_time') || 'Select Time'} *</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="form-select"
                required
              >
                <option value="">{t('choose_time') || 'Choose Time'}</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('patient_name') || 'Patient Name'} *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t('enter_patient_name') || 'Enter patient name'}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>{t('patient_age') || 'Patient Age'} *</label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder={t('enter_age') || 'Enter age'}
                className="form-input"
                min="1"
                max="120"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('symptoms_reason') || 'Symptoms/Reason for Visit'}</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t('describe_symptoms') || 'Describe your symptoms or reason for consultation'}
              className="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div className="appointment-summary">
            <div className="summary-item">
              <span>{t('doctor') || 'Doctor'}:</span>
              <span>{doctor.name}</span>
            </div>
            <div className="summary-item">
              <span>{t('date_time') || 'Date & Time'}:</span>
              <span>{selectedDate} at {selectedTime}</span>
            </div>
            <div className="summary-item">
              <span>{t('consultation_fee')}:</span>
              <span>₹{doctor.consultationFee}</span>
            </div>
            <div className="summary-item total">
              <span>{t('total_amount') || 'Total Amount'}:</span>
              <span>₹{doctor.consultationFee}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              {t('cancel') || 'Cancel'}
            </button>
            <button type="submit" className="confirm-btn" disabled={loading}>
              {loading ? (t('booking') || 'Booking...') : (t('confirm_booking') || 'Confirm Booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentModal;