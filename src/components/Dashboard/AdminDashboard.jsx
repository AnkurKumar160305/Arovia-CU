import React from 'react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import DadiChatBot from '../ChatBot/DadiChatBot';
import CreateDoctorModal from './CreateDoctorModal';
import './Dashboard.css';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [showCreateDoctorModal, setShowCreateDoctorModal] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleCreateDoctor = () => {
    setShowCreateDoctorModal(true);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>{t('admin_dashboard')}</h1>
          <button className="logout-btn" onClick={handleLogout}>
            <ion-icon name="log-out-outline"></ion-icon>
            {t('logout')}
          </button>
        </div>
        
        <div className="dashboard-content">
          <div className="welcome-card">
            <h2>{t('welcome_back')}, {user?.name}!</h2>
            <p><strong>Mobile:</strong> {user?.mobile}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Access Level:</strong> <span style={{color: '#ed8936', fontWeight: 'bold'}}>Super Admin</span></p>
            <p><strong>Last Login:</strong> {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="people-outline"></ion-icon>
              </div>
              <h3>User Management</h3>
              <p>Manage all users, doctors, and patient accounts across the platform</p>
            </div>
            
            <div className="dashboard-card" onClick={handleCreateDoctor}>
              <div className="card-icon">
                <ion-icon name="medical-outline"></ion-icon>
              </div>
              <h3>Create Doctor Account</h3>
              <p>Add new doctors to the platform and create their profiles</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="business-outline"></ion-icon>
              </div>
              <h3>Hospital Management</h3>
              <p>Oversee hospitals, clinics, and medical facility registrations</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="analytics-outline"></ion-icon>
              </div>
              <h3>System Analytics</h3>
              <p>View comprehensive system-wide analytics and performance reports</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="shield-checkmark-outline"></ion-icon>
              </div>
              <h3>Security & Compliance</h3>
              <p>Monitor system security, data privacy, and regulatory compliance</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <ion-icon name="settings-outline"></ion-icon>
              </div>
              <h3>System Configuration</h3>
              <p>Configure system settings, features, and platform parameters</p>
            </div>
          </div>
        </div>
        
        <DadiChatBot />
      </div>
      
      {showCreateDoctorModal && (
        <CreateDoctorModal
          isOpen={showCreateDoctorModal}
          onClose={() => setShowCreateDoctorModal(false)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;