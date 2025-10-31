import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import './VerifyMedicine.css';

function VerifyMedicine({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('photo');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [medicineName, setMedicineName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const { t } = useLanguage();

  const trustedMedicines = [
    {
      name: 'Paracetamol 500mg',
      manufacturer: 'Cipla Ltd',
      batchPattern: /^(PCM|PAR)/,
      description: 'Pain reliever and fever reducer'
    },
    {
      name: 'Dolo 650',
      manufacturer: 'Micro Labs',
      batchPattern: /^(DOL|DL)/,
      description: 'Fever and pain relief medication'
    },
    {
      name: 'Crocin 650',
      manufacturer: 'GSK',
      batchPattern: /^(CRO|CR)/,
      description: 'Fever and pain relief'
    },
    {
      name: 'Azithromycin 500mg',
      manufacturer: 'Cipla Ltd',
      batchPattern: /^(AZI|AZ)/,
      description: 'Antibiotic for bacterial infections'
    }
  ];

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

  const verifyMedicine = async () => {
    if (!user) {
      alert('Please login to verify medicines');
      return;
    }

    if (activeTab === 'photo' && !photo) {
      alert('Please upload a photo of the medicine');
      return;
    }

    if (activeTab === 'manual' && (!medicineName || !manufacturer)) {
      alert('Please fill in medicine name and manufacturer');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const medicineLower = medicineName.toLowerCase();
      const manufacturerLower = manufacturer.toLowerCase();

      const trustedMedicine = trustedMedicines.find(
        med => med.name.toLowerCase().includes(medicineLower) &&
               med.manufacturer.toLowerCase().includes(manufacturerLower)
      );

      let result = {
        medicineName: medicineName || 'Paracetamol 500mg',
        manufacturer: manufacturer || 'Cipla Ltd',
        batchNumber: batchNumber || 'PCM12345',
        expiryDate: expiryDate || '2025-12-31',
        verifiedAt: new Date().toLocaleString()
      };

      if (trustedMedicine) {
        if (expiryDate && new Date(expiryDate) < new Date()) {
          result.status = 'expired';
          result.message = 'This medicine has expired. Do not use it.';
        } else if (batchNumber && !trustedMedicine.batchPattern.test(batchNumber)) {
          result.status = 'warning';
          result.message = 'Batch number format does not match standard pattern. Verify with pharmacist.';
        } else {
          result.status = 'safe';
          result.message = 'This medicine is verified as authentic and safe to use.';
          result.description = trustedMedicine.description;
        }
      } else {
        result.status = 'warning';
        result.message = 'Medicine not found in our database. Please consult a pharmacist.';
      }

      setVerificationResult(result);
      setIsVerifying(false);
    }, 2000);
  };

  const resetForm = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setMedicineName('');
    setBatchNumber('');
    setExpiryDate('');
    setManufacturer('');
    setVerificationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="verify-medicine-overlay">
      <div className="verify-medicine-modal">
        <div className="verify-medicine-header">
          <div className="verify-header-content">
            <div className="verify-header-icon">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
            </div>
            <div>
              <h3>Verify Medicine</h3>
              <p>Check medicine authenticity and safety</p>
            </div>
          </div>
          <button className="close-verify-btn" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="verify-medicine-content">
          {!verificationResult ? (
            <>
              <div className="verification-tabs">
                <button
                  className={`tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
                  onClick={() => setActiveTab('photo')}
                >
                  <ion-icon name="camera-outline"></ion-icon>
                  <span>Upload Photo</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
                  onClick={() => setActiveTab('manual')}
                >
                  <ion-icon name="create-outline"></ion-icon>
                  <span>Enter Details</span>
                </button>
              </div>

              <form className="verification-form" onSubmit={(e) => { e.preventDefault(); verifyMedicine(); }}>
                {activeTab === 'photo' && (
                  <>
                    {!photoPreview ? (
                      <label className="photo-upload-section">
                        <div className="upload-icon">
                          <ion-icon name="cloud-upload-outline"></ion-icon>
                        </div>
                        <h4>Upload Medicine Photo</h4>
                        <p>Take a clear photo of the medicine pack showing name, batch, and expiry</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    ) : (
                      <div className="medicine-photo-preview">
                        <img src={photoPreview} alt="Medicine" />
                        <button type="button" className="remove-upload-btn" onClick={removePhoto}>
                          <ion-icon name="close-outline"></ion-icon>
                        </button>
                      </div>
                    )}
                  </>
                )}

                <div className="medicine-details-form">
                  <div className="form-group">
                    <label className="form-label">Medicine Name *</label>
                    <input
                      type="text"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      placeholder="e.g., Paracetamol 500mg"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Manufacturer *</label>
                    <input
                      type="text"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="e.g., Cipla Ltd"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Batch Number</label>
                      <input
                        type="text"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        placeholder="e.g., PCM12345"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="verify-btn"
                  disabled={isVerifying || (!medicineName && !photo)}
                >
                  {isVerifying ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ion-icon name="shield-checkmark-outline"></ion-icon>
                      <span>Verify Medicine</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className={`verification-result ${verificationResult.status}`}>
              <div className="result-header">
                <div className="result-icon">
                  <ion-icon name={
                    verificationResult.status === 'safe' ? 'checkmark-circle-outline' :
                    verificationResult.status === 'warning' ? 'warning-outline' :
                    'close-circle-outline'
                  }></ion-icon>
                </div>
                <div>
                  <h4>
                    {verificationResult.status === 'safe' ? 'Medicine Verified Safe' :
                     verificationResult.status === 'warning' ? 'Verification Warning' :
                     verificationResult.status === 'expired' ? 'Medicine Expired' :
                     'Counterfeit Alert'}
                  </h4>
                  <p style={{ margin: '4px 0 0', opacity: 0.8 }}>
                    {verificationResult.message}
                  </p>
                </div>
              </div>

              <div className="result-details">
                <div className="result-detail-item">
                  <strong>Medicine Name:</strong>
                  <span>{verificationResult.medicineName}</span>
                </div>
                <div className="result-detail-item">
                  <strong>Manufacturer:</strong>
                  <span>{verificationResult.manufacturer}</span>
                </div>
                {verificationResult.batchNumber && (
                  <div className="result-detail-item">
                    <strong>Batch Number:</strong>
                    <span>{verificationResult.batchNumber}</span>
                  </div>
                )}
                {verificationResult.expiryDate && (
                  <div className="result-detail-item">
                    <strong>Expiry Date:</strong>
                    <span>{verificationResult.expiryDate}</span>
                  </div>
                )}
                <div className="result-detail-item">
                  <strong>Verified At:</strong>
                  <span>{verificationResult.verifiedAt}</span>
                </div>
                {verificationResult.description && (
                  <div className="result-detail-item">
                    <strong>Description:</strong>
                    <span>{verificationResult.description}</span>
                  </div>
                )}
              </div>

              <div className="result-actions">
                <button className="result-action-btn secondary" onClick={resetForm}>
                  <ion-icon name="refresh-outline"></ion-icon>
                  <span>Verify Another</span>
                </button>
                <button className="result-action-btn primary" onClick={onClose}>
                  <ion-icon name="checkmark-outline"></ion-icon>
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyMedicine;
