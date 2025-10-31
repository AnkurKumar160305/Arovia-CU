import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './LocationModal.css';

function LocationModal({ isOpen, onClose }) {
  const [location, setLocation] = useState(null);
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchIPAddress();
    }
  }, [isOpen]);

  const fetchIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIpAddress(data.ip);
    } catch (error) {
      console.error('Failed to fetch IP address:', error);
    }
  };

  const handleAllowLocation = async () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            ipAddress
          };

          try {
            // Get address from coordinates
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY`
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.results && data.results[0]) {
                locationData.address = data.results[0].formatted;
              }
            }
          } catch (error) {
            console.log('Failed to get address');
          }

          setLocation(locationData);
          
          // Update user location in backend if user is logged in
          if (user) {
            try {
              await axios.put('http://localhost:5000/api/user/location', locationData);
            } catch (error) {
              console.error('Failed to update location:', error);
            }
          }

          // Store in localStorage for non-logged in users
          localStorage.setItem('userLocation', JSON.stringify(locationData));
          
          setLoading(false);
          onClose();
        },
        (error) => {
          console.error('Location access denied:', error);
          setLoading(false);
          onClose();
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <div className="location-modal-header">
          <h3>{t('location_permission')}</h3>
        </div>
        
        <div className="location-modal-content">
          <div className="location-icon">
            <ion-icon name="location-outline"></ion-icon>
          </div>
          
          <p>{t('location_message')}</p>
          
          {ipAddress && (
            <div className="ip-info">
              <p><strong>{t('ip_address')}:</strong> {ipAddress}</p>
            </div>
          )}
        </div>
        
        <div className="location-modal-actions">
          <button 
            className="location-allow-btn" 
            onClick={handleAllowLocation}
            disabled={loading}
          >
            {loading ? 'Getting Location...' : t('allow_location')}
          </button>
          <button className="location-skip-btn" onClick={onClose}>
            {t('skip')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;