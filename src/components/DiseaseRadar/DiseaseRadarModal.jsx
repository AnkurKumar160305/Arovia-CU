import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './DiseaseRadarModal.css';

function DiseaseRadarModal({ isOpen, onClose }) {
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const { t } = useLanguage();

  // Mock disease outbreak data - In production, this would come from health authorities API
  const mockOutbreaks = [
    {
      id: 1,
      disease: 'Dengue Fever',
      location: 'Delhi NCR',
      severity: 'high',
      cases: 1250,
      trend: 'increasing',
      lastUpdated: '2024-01-15',
      description: 'Significant increase in dengue cases reported across Delhi NCR region. Residents advised to take preventive measures.',
      symptoms: ['High fever', 'Severe headache', 'Body aches', 'Nausea', 'Skin rash'],
      prevention: ['Remove stagnant water', 'Use mosquito repellent', 'Wear full sleeves', 'Keep surroundings clean'],
      distance: 2.5
    },
    {
      id: 2,
      disease: 'Viral Fever',
      location: 'Mumbai Metropolitan',
      severity: 'medium',
      cases: 890,
      trend: 'stable',
      lastUpdated: '2024-01-14',
      description: 'Seasonal viral fever cases reported in Mumbai. Weather changes contributing to spread.',
      symptoms: ['Fever', 'Cough', 'Cold', 'Body weakness', 'Throat pain'],
      prevention: ['Maintain hygiene', 'Avoid crowded places', 'Drink warm water', 'Rest adequately'],
      distance: 15.2
    },
    {
      id: 3,
      disease: 'Gastroenteritis',
      location: 'Bangalore Urban',
      severity: 'medium',
      cases: 567,
      trend: 'decreasing',
      lastUpdated: '2024-01-13',
      description: 'Food and waterborne illness cases reported. Contaminated water sources identified.',
      symptoms: ['Stomach pain', 'Diarrhea', 'Vomiting', 'Dehydration', 'Fever'],
      prevention: ['Drink boiled water', 'Eat fresh food', 'Wash hands frequently', 'Avoid street food'],
      distance: 8.7
    },
    {
      id: 4,
      disease: 'Respiratory Infection',
      location: 'Pune District',
      severity: 'low',
      cases: 234,
      trend: 'stable',
      lastUpdated: '2024-01-12',
      description: 'Mild respiratory infections due to air quality and weather changes.',
      symptoms: ['Cough', 'Breathing difficulty', 'Chest congestion', 'Fatigue'],
      prevention: ['Wear masks', 'Avoid pollution', 'Stay hydrated', 'Use air purifiers'],
      distance: 12.3
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      
      // Get user location from localStorage
      const location = localStorage.getItem('userLocation');
      if (location) {
        setUserLocation(JSON.parse(location));
      }

      // Simulate API call
      setTimeout(() => {
        // Sort outbreaks by distance and severity
        const sortedOutbreaks = mockOutbreaks.sort((a, b) => {
          if (a.severity === 'high' && b.severity !== 'high') return -1;
          if (b.severity === 'high' && a.severity !== 'high') return 1;
          return a.distance - b.distance;
        });
        
        setOutbreaks(sortedOutbreaks);
        setLoading(false);
      }, 1500);
    }
  }, [isOpen]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return 'trending-up-outline';
      case 'decreasing': return 'trending-down-outline';
      case 'stable': return 'remove-outline';
      default: return 'help-outline';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return '#dc2626';
      case 'decreasing': return '#059669';
      case 'stable': return '#d97706';
      default: return '#6b7280';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="disease-radar-overlay">
      <div className="disease-radar-modal">
        <div className="disease-radar-header">
          <div className="header-content">
            <div className="header-icon">
              <ion-icon name="pulse-outline"></ion-icon>
            </div>
            <div>
              <h3>Disease Outbreak Radar</h3>
              <p>Real-time health alerts in your area</p>
            </div>
          </div>
          <button className="close-radar-btn" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="radar-content">
          {userLocation && (
            <div className="location-info">
              <ion-icon name="location-outline"></ion-icon>
              <span>Monitoring outbreaks near your location</span>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="radar-spinner">
                <div className="radar-circle"></div>
                <div className="radar-pulse"></div>
              </div>
              <p>Scanning for disease outbreaks...</p>
            </div>
          ) : (
            <div className="outbreaks-list">
              {outbreaks.length > 0 ? (
                <>
                  <div className="outbreaks-summary">
                    <h4>{outbreaks.length} Active Outbreaks Detected</h4>
                    <p>Stay informed and take necessary precautions</p>
                  </div>
                  
                  {outbreaks.map((outbreak) => (
                    <div key={outbreak.id} className="outbreak-card">
                      <div className="outbreak-header">
                        <div className="outbreak-title">
                          <h5>{outbreak.disease}</h5>
                          <div className="outbreak-location">
                            <ion-icon name="location-outline"></ion-icon>
                            <span>{outbreak.location}</span>
                            <span className="distance">{outbreak.distance} km away</span>
                          </div>
                        </div>
                        
                        <div className="outbreak-indicators">
                          <div 
                            className="severity-badge"
                            style={{ backgroundColor: getSeverityColor(outbreak.severity) }}
                          >
                            {outbreak.severity.toUpperCase()}
                          </div>
                          <div 
                            className="trend-indicator"
                            style={{ color: getTrendColor(outbreak.trend) }}
                          >
                            <ion-icon name={getTrendIcon(outbreak.trend)}></ion-icon>
                          </div>
                        </div>
                      </div>

                      <div className="outbreak-stats">
                        <div className="stat-item">
                          <span className="stat-label">Cases</span>
                          <span className="stat-value">{outbreak.cases.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Trend</span>
                          <span className="stat-value">{outbreak.trend}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Updated</span>
                          <span className="stat-value">{new Date(outbreak.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="outbreak-description">
                        <p>{outbreak.description}</p>
                      </div>

                      <div className="outbreak-details">
                        <div className="detail-section">
                          <h6>Common Symptoms</h6>
                          <div className="symptoms-list">
                            {outbreak.symptoms.map((symptom, index) => (
                              <span key={index} className="symptom-tag">
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="detail-section">
                          <h6>Prevention Measures</h6>
                          <ul className="prevention-list">
                            {outbreak.prevention.map((measure, index) => (
                              <li key={index}>
                                <ion-icon name="checkmark-circle-outline"></ion-icon>
                                {measure}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="outbreak-actions">
                        <button className="action-btn primary">
                          <ion-icon name="call-outline"></ion-icon>
                          Contact Health Dept
                        </button>
                        <button className="action-btn secondary">
                          <ion-icon name="medical-outline"></ion-icon>
                          Find Nearby Doctors
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="no-outbreaks">
                  <div className="no-outbreaks-icon">
                    <ion-icon name="shield-checkmark-outline"></ion-icon>
                  </div>
                  <h4>No Active Outbreaks</h4>
                  <p>Your area is currently safe from major disease outbreaks</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="radar-footer">
          <div className="disclaimer">
            <ion-icon name="information-circle-outline"></ion-icon>
            <span>Data sourced from health authorities. Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseRadarModal;