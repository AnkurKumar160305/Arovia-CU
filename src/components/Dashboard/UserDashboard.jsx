import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import DadiChatBot from '../ChatBot/DadiChatBot';
import './Dashboard.css';

function UserDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>{t('user_dashboard')}</h1>
          <button className="logout-btn" onClick={handleLogout}>
            <ion-icon name="log-out-outline"></ion-icon>
            {t('logout')}
          </button>
        </div>
        
        <div className="dashboard-content">
          <div className="welcome-card">
            <h2>{t('welcome_back')}, {user?.name}!</h2>
            <p><strong>Mobile:</strong> {user?.mobile}</p>
            <p><strong>Age:</strong> {user?.age}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Language:</strong> {user?.language === 'hi' ? 'हिंदी' : 'English'}</p>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="calendar-outline"></ion-icon>
              </div>
              <h3>My Appointments</h3>
              <p>View and manage your upcoming medical appointments with doctors</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="medical-outline"></ion-icon>
              </div>
              <h3>Medical Records</h3>
              <p>Access your complete medical history, prescriptions, and test reports</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="search-outline"></ion-icon>
              </div>
              <h3>Find Doctors</h3>
              <p>Search for nearby doctors and specialists based on your location</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="fitness-outline"></ion-icon>
              </div>
              <h3>Health Tracker</h3>
              <p>Monitor your vital signs, medications, and health progress</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="notifications-outline"></ion-icon>
              </div>
              <h3>Health Reminders</h3>
              <p>Set reminders for medications, appointments, and health checkups</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="settings-outline"></ion-icon>
              </div>
              <h3>Account Settings</h3>
              <p>Manage your profile, privacy settings, and notification preferences</p>
            </div>
          </div>
        </div>
        
        <DadiChatBot />
      </div>
    </div>
  );
}

export default UserDashboard;