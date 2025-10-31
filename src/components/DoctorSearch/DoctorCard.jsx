import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import AppointmentModal from './AppointmentModal';

function DoctorCard({ doctor }) {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const { t } = useLanguage();

  const handleCallNow = () => {
    window.open(`tel:${doctor.phone}`, '_self');
  };

  const handleBookAppointment = () => {
    setShowAppointmentModal(true);
  };

  return (
    <>
      <div className="doctor-card">
        <div className="doctor-card-header">
          <div className="doctor-image">
            <img src={doctor.image} alt={doctor.name} />
            <div className="availability-badge">
              <span className={`status ${doctor.availability.includes('Today') ? 'available' : 'busy'}`}>
                {doctor.availability}
              </span>
            </div>
          </div>
          
          <div className="doctor-info">
            <h3>{doctor.name}</h3>
            <p className="speciality">{doctor.speciality}</p>
            <p className="experience">{doctor.experience} {t('years_experience')}</p>
            
            <div className="rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <ion-icon 
                    key={i} 
                    name={i < Math.floor(doctor.rating) ? "star" : "star-outline"}
                    className={i < Math.floor(doctor.rating) ? "filled" : ""}
                  ></ion-icon>
                ))}
              </div>
              <span className="rating-text">{doctor.rating} ({doctor.reviews} {t('reviews')})</span>
            </div>
          </div>
        </div>

        <div className="doctor-details">
          <div className="location-info">
            <ion-icon name="location-outline"></ion-icon>
            <span>{doctor.location}</span>
            <span className="distance">{doctor.distance} {t('km_away')}</span>
          </div>

          <div className="qualifications">
            <strong>{t('qualifications')}:</strong>
            <div className="qualification-tags">
              {doctor.qualifications.map((qual, index) => (
                <span key={index} className="qualification-tag">{qual}</span>
              ))}
            </div>
          </div>

          <div className="languages">
            <strong>{t('languages')}:</strong>
            <span>{doctor.languages.join(', ')}</span>
          </div>
        </div>

        <div className="doctor-card-footer">
          <div className="consultation-fee">
            <span className="fee-label">{t('consultation_fee')}</span>
            <span className="fee-amount">₹{doctor.consultationFee}</span>
          </div>

          <div className="action-buttons">
            <button className="call-btn" onClick={handleCallNow}>
              <ion-icon name="call-outline"></ion-icon>
              {t('call_now')}
            </button>
            <button className="book-btn" onClick={handleBookAppointment}>
              <ion-icon name="calendar-outline"></ion-icon>
              {t('book_appointment')}
            </button>
          </div>
        </div>
      </div>

      {showAppointmentModal && (
        <AppointmentModal
          doctor={doctor}
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
        />
      )}
    </>
  );
}

export default DoctorCard;