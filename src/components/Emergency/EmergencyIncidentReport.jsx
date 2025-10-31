import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './EmergencyIncidentReport.css';

function EmergencyIncidentReport({ isOpen, onClose }) {
  const [incidentType, setIncidentType] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textDescription, setTextDescription] = useState('');
  const [priority, setPriority] = useState('high');
  const [gpsLocation, setGpsLocation] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('detecting');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchingHospitals, setMatchingHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [suggestedAreas, setSuggestedAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showHospitalMatching, setShowHospitalMatching] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  const { user } = useAuth();
  const { t } = useLanguage();

  const incidentTypes = [
    { id: 'accident', label: 'Accident', icon: 'car-outline' },
    { id: 'heart-attack', label: 'Heart Attack', icon: 'heart-outline' },
    { id: 'stroke', label: 'Stroke', icon: 'fitness-outline' },
    { id: 'breathing', label: 'Breathing Issue', icon: 'pulse-outline' },
    { id: 'injury', label: 'Severe Injury', icon: 'bandage-outline' },
    { id: 'poisoning', label: 'Poisoning', icon: 'flask-outline' },
    { id: 'other', label: 'Other Emergency', icon: 'warning-outline' }
  ];

  useEffect(() => {
    if (isOpen) {
      detectLocation();
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isOpen]);

  const detectLocation = () => {
    setGpsStatus('detecting');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString()
          };

          try {
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

          setGpsLocation(locationData);
          setGpsStatus('success');
        },
        (error) => {
          console.error('Location access denied:', error);
          setGpsStatus('failed');
        }
      );
    } else {
      setGpsStatus('not_supported');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const findNearbyHospitals = async () => {
    const mockHospitals = [
      {
        id: 1,
        name: 'Apollo Emergency Center',
        distance: 2.3,
        availability: 'Available',
        specialization: 'Multi-specialty'
      },
      {
        id: 2,
        name: 'Max Hospital Emergency',
        distance: 3.1,
        availability: 'Available',
        specialization: 'Trauma Care'
      }
    ];

    const mockSuggestedAreas = [
      { id: 1, name: 'Delhi NCR', distance: 15 },
      { id: 2, name: 'Gurgaon', distance: 25 },
      { id: 3, name: 'Noida', distance: 20 }
    ];

    setTimeout(() => {
      if (mockHospitals.length > 0) {
        setMatchingHospitals(mockHospitals);
      } else {
        setSuggestedAreas(mockSuggestedAreas);
      }
      setShowHospitalMatching(true);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!incidentType) {
      alert('Please select an incident type');
      return;
    }

    if (!user) {
      alert('Please login to report an emergency');
      return;
    }

    setIsSubmitting(true);

    try {
      await findNearbyHospitals();
    } catch (error) {
      console.error('Error submitting emergency report:', error);
      alert('Failed to submit emergency report. Please try again.');
      setIsSubmitting(false);
    }
  };

  const confirmSubmit = () => {
    alert(`Emergency report submitted successfully! ${selectedHospital ? `Assigned to: ${selectedHospital.name}` : selectedArea ? `Searching in: ${selectedArea.name}` : 'Searching for nearby hospitals...'}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="emergency-report-overlay">
      <div className="emergency-report-modal">
        <div className="emergency-report-header">
          <div className="emergency-header-content">
            <div className="emergency-header-icon">
              <ion-icon name="medical-outline"></ion-icon>
            </div>
            <div>
              <h3>Emergency Incident Report</h3>
              <p>Report medical emergency with details</p>
            </div>
          </div>
          <button className="close-report-btn" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="emergency-report-content">
          <div className={`gps-status ${gpsStatus === 'success' ? 'success' : ''}`}>
            <ion-icon name={
              gpsStatus === 'success' ? 'checkmark-circle-outline' :
              gpsStatus === 'detecting' ? 'location-outline' :
              'warning-outline'
            }></ion-icon>
            <span>
              {gpsStatus === 'success' && gpsLocation ?
                `Location: ${gpsLocation.address || 'Coordinates captured'}` :
                gpsStatus === 'detecting' ? 'Detecting GPS location...' :
                'Location unavailable - Will use manual entry'
              }
            </span>
          </div>

          {!showHospitalMatching ? (
            <form className="report-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="form-section">
                <h4>
                  <ion-icon name="alert-circle-outline"></ion-icon>
                  Incident Type
                </h4>
                <div className="incident-type-grid">
                  {incidentTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`incident-type-btn ${incidentType === type.id ? 'selected' : ''}`}
                      onClick={() => setIncidentType(type.id)}
                    >
                      <ion-icon name={type.icon}></ion-icon>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h4>
                  <ion-icon name="camera-outline"></ion-icon>
                  Upload Photo
                </h4>
                <div className="upload-section">
                  {!photoPreview ? (
                    <label className="upload-btn">
                      <ion-icon name="cloud-upload-outline"></ion-icon>
                      <span>Upload Photo of Incident</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  ) : (
                    <div className="upload-preview">
                      <img src={photoPreview} alt="Incident" />
                      <button type="button" className="remove-upload-btn" onClick={removePhoto}>
                        <ion-icon name="close-outline"></ion-icon>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h4>
                  <ion-icon name="mic-outline"></ion-icon>
                  Voice Description (Priority)
                </h4>
                <div className="upload-section">
                  {!audioBlob ? (
                    <button
                      type="button"
                      className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      <ion-icon name={isRecording ? 'stop-circle-outline' : 'mic-outline'}></ion-icon>
                      {isRecording ? (
                        <>
                          <span>Recording...</span>
                          <span className="recording-timer">{formatTime(recordingTime)}</span>
                        </>
                      ) : (
                        <span>Start Voice Recording</span>
                      )}
                    </button>
                  ) : (
                    <div className="voice-playback">
                      <button type="button" className="play-btn">
                        <ion-icon name="play-outline"></ion-icon>
                      </button>
                      <div className="audio-waveform">
                        Voice recorded: {formatTime(recordingTime)}
                      </div>
                      <button type="button" className="remove-upload-btn" onClick={removeAudio}>
                        <ion-icon name="close-outline"></ion-icon>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h4>
                  <ion-icon name="document-text-outline"></ion-icon>
                  Text Description (Optional)
                </h4>
                <textarea
                  className="text-description-area"
                  placeholder="Describe the emergency situation in detail..."
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="form-section">
                <h4>
                  <ion-icon name="flag-outline"></ion-icon>
                  Priority Level
                </h4>
                <div className="priority-selector">
                  {['low', 'medium', 'high', 'critical'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`priority-btn ${level} ${priority === level ? 'selected' : ''}`}
                      onClick={() => setPriority(level)}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="submit-section">
                <button
                  type="submit"
                  className="submit-report-btn"
                  disabled={isSubmitting || !incidentType}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Finding Hospitals...</span>
                    </>
                  ) : (
                    <>
                      <ion-icon name="send-outline"></ion-icon>
                      <span>Submit Emergency Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="hospital-matching-section">
              <h4>Available Hospitals & Doctors</h4>

              {matchingHospitals.length > 0 ? (
                <>
                  <div className="matching-status">
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                    <span>Found {matchingHospitals.length} nearby facilities</span>
                  </div>
                  <div className="hospital-list">
                    {matchingHospitals.map((hospital) => (
                      <div
                        key={hospital.id}
                        className={`hospital-card ${selectedHospital?.id === hospital.id ? 'selected' : ''}`}
                        onClick={() => setSelectedHospital(hospital)}
                      >
                        <h5>{hospital.name}</h5>
                        <p>Distance: {hospital.distance} km away</p>
                        <p>Status: {hospital.availability}</p>
                        <p>Specialization: {hospital.specialization}</p>
                      </div>
                    ))}
                  </div>
                  <button className="submit-report-btn" onClick={confirmSubmit} style={{ marginTop: '20px' }}>
                    <ion-icon name="checkmark-outline"></ion-icon>
                    <span>Confirm & Send to Hospital</span>
                  </button>
                </>
              ) : (
                <div className="area-suggestions">
                  <div className="matching-status">
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <span>No hospitals available in your area</span>
                  </div>
                  <h5>Suggested Nearby Areas:</h5>
                  <div className="area-list">
                    {suggestedAreas.map((area) => (
                      <button
                        key={area.id}
                        className={`area-btn ${selectedArea?.id === area.id ? 'selected' : ''}`}
                        onClick={() => setSelectedArea(area)}
                      >
                        {area.name} ({area.distance} km)
                      </button>
                    ))}
                  </div>
                  <button
                    className="submit-report-btn"
                    onClick={confirmSubmit}
                    disabled={!selectedArea}
                    style={{ marginTop: '20px' }}
                  >
                    <ion-icon name="search-outline"></ion-icon>
                    <span>Search in Selected Area</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmergencyIncidentReport;
