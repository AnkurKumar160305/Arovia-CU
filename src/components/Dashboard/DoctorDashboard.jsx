import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import DadiChatBot from '../ChatBot/DadiChatBot';
import './Dashboard.css';

function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="doctor-dashboard">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>{t('doctor_dashboard')}</h1>
          <button className="logout-btn" onClick={handleLogout}>
            <ion-icon name="log-out-outline"></ion-icon>
            {t('logout')}
          </button>
        </div>
        
        <div className="dashboard-content">
          <div className="welcome-card">
            <h2>{t('welcome_back')}, Dr. {user?.name}!</h2>
            <p><strong>Mobile:</strong> {user?.mobile}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Status:</strong> <span style={{color: '#48bb78', fontWeight: 'bold'}}>Active</span></p>
            <p><strong>Specialization:</strong> General Medicine</p>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="people-outline"></ion-icon>
              </div>
              <h3>My Patients</h3>
              <p>View and manage your patient records, medical history, and treatment plans</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="calendar-outline"></ion-icon>
              </div>
              <h3>Appointments</h3>
              <p>Manage your appointment schedule, view upcoming consultations</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="document-text-outline"></ion-icon>
              </div>
              <h3>Prescriptions</h3>
              <p>Create digital prescriptions, manage medication lists and dosages</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="flask-outline"></ion-icon>
              </div>
              <h3>Lab Reports</h3>
              <p>Review patient lab results, diagnostic reports, and test outcomes</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="analytics-outline"></ion-icon>
              </div>
              <h3>Practice Analytics</h3>
              <p>View practice statistics, patient demographics, and performance metrics</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="videocam-outline"></ion-icon>
              </div>
              <h3>Telemedicine</h3>
              <p>Conduct virtual consultations and remote patient monitoring</p>
            </div>
          </div>
        </div>
        
        <DadiChatBot />
      </div>
    </div>
  );
}

export default DoctorDashboard;