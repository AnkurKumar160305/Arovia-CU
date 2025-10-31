import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import './EmergencySOSModal.css';

function EmergencySOSModal({ isOpen, onClose }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('detecting');
  const { t } = useLanguage();
  const { user } = useAuth();

  const emergencyContacts = [
    {
      id: 1,
      name: 'Ambulance',
      number: '108',
      icon: 'car-outline',
      description: 'Emergency Medical Services'
    },
    {
      id: 2,
      name: 'Police',
      number: '100',
      icon: 'shield-outline',
      description: 'Police Emergency'
    },
    {
      id: 3,
      name: 'Fire Brigade',
      number: '101',
      icon: 'flame-outline',
      description: 'Fire Emergency'
    },
    {
      id: 4,
      name: 'Women Helpline',
      number: '1091',
      icon: 'person-outline',
      description: 'Women in Distress'
    },
    {
      id: 5,
      name: 'Child Helpline',
      number: '1098',
      icon: 'heart-outline',
      description: 'Child in Need'
    },
    {
      id: 6,
      name: 'Disaster Management',
      number: '1070',
      icon: 'warning-outline',
      description: 'Natural Disasters'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      detectLocation();
    }
  }, [isOpen]);

  const detectLocation = () => {
    setLocationStatus('detecting');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString()
          };

          try {
            // Get address from coordinates
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            if (data.city && data.principalSubdivision) {
              locationData.address = `${data.city}, ${data.principalSubdivision}`;
            } else if (data.locality) {
              locationData.address = data.locality;
            }
          } catch (error) {
            console.error('Failed to get address:', error);
          }

          setUserLocation(locationData);
          setLocationStatus('success');
        },
        (error) => {
          console.error('Location access denied:', error);
          setLocationStatus('failed');
        }
      );
    } else {
      setLocationStatus('not_supported');
    }
  };

  const handleEmergencyCall = (number) => {
    // Create emergency message with location
    const locationText = userLocation 
      ? `Location: ${userLocation.address || `${userLocation.latitude}, ${userLocation.longitude}`}`
      : 'Location: Not available';
    
    const emergencyMessage = `EMERGENCY ALERT!\n${user ? `Name: ${user.name}\nMobile: ${user.mobile}\n` : ''}${locationText}\nTime: ${new Date().toLocaleString()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(emergencyMessage).catch(() => {
      console.log('Could not copy to clipboard');
    });
    
    // Make the call
    window.open(`tel:${number}`, '_self');
  };

  const handleShareLocation = () => {
    if (userLocation && navigator.share) {
      const locationText = userLocation.address || `${userLocation.latitude}, ${userLocation.longitude}`;
      navigator.share({
        title: 'Emergency Location Share',
        text: `I need help! My current location is: ${locationText}`,
        url: `https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`
      });
    } else if (userLocation) {
      // Fallback: copy to clipboard
      const locationText = userLocation.address || `${userLocation.latitude}, ${userLocation.longitude}`;
      const shareText = `I need help! My current location is: ${locationText}\nGoogle Maps: https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`;
      navigator.clipboard.writeText(shareText);
      alert('Location copied to clipboard!');
    }
  };

  const handleFindNearbyHospitals = () => {
    if (userLocation) {
      const mapsUrl = `https://maps.google.com/maps?q=hospitals+near+${userLocation.latitude},${userLocation.longitude}`;
      window.open(mapsUrl, '_blank');
    } else {
      alert('Location not available. Please enable location access.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="emergency-sos-overlay">
      <div className="emergency-sos-modal">
        <div className="emergency-sos-header">
          <div className="emergency-header-content">
            <div className="emergency-header-icon">
              <ion-icon name="medical-outline"></ion-icon>
            </div>
            <div>
              <h3>Emergency SOS</h3>
              <p>One-tap emergency assistance</p>
            </div>
          </div>
          <button className="close-emergency-btn" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="emergency-content">
          <div className={`location-status ${locationStatus === 'success' ? 'success' : ''}`}>
            <ion-icon name={
              locationStatus === 'success' ? 'checkmark-circle-outline' : 
              locationStatus === 'detecting' ? 'location-outline' : 
              'warning-outline'
            }></ion-icon>
            <span>
              {locationStatus === 'success' && userLocation ? 
                `Location detected: ${userLocation.address || 'Coordinates available'}` :
                locationStatus === 'detecting' ? 'Detecting your location...' :
                'Location access denied - Emergency services may ask for your location'
              }
            </span>
          </div>

          <div className="emergency-actions">
            <div className="emergency-action-card" onClick={handleShareLocation}>
              <div className="emergency-action-icon">
                <ion-icon name="share-outline"></ion-icon>
              </div>
              <h4>Share Location</h4>
              <p>Instantly share your current location with emergency contacts</p>
            </div>

            <div className="emergency-action-card" onClick={handleFindNearbyHospitals}>
              <div className="emergency-action-icon">
                <ion-icon name="business-outline"></ion-icon>
              </div>
              <h4>Find Hospitals</h4>
              <p>Locate nearest hospitals and medical facilities</p>
            </div>

            <div className="emergency-action-card" onClick={() => handleEmergencyCall('108')}>
              <div className="emergency-action-icon">
                <ion-icon name="call-outline"></ion-icon>
              </div>
              <h4>Call Ambulance</h4>
              <p>Direct call to emergency medical services (108)</p>
            </div>
          </div>

          <div className="emergency-contacts">
            <h4>
              <ion-icon name="call-outline"></ion-icon>
              Emergency Contacts
            </h4>
            <div className="contacts-grid">
              {emergencyContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className="contact-item"
                  onClick={() => handleEmergencyCall(contact.number)}
                >
                  <div className="contact-icon">
                    <ion-icon name={contact.icon}></ion-icon>
                  </div>
                  <div className="contact-info">
                    <h5>{contact.name}</h5>
                    <p>{contact.number} - {contact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="emergency-disclaimer">
            <p>
              <strong>Important:</strong> This is for genuine emergencies only. 
              Your location will be automatically shared with emergency services when you make a call. 
              Misuse of emergency services is a punishable offense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencySOSModal;