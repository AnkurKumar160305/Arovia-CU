import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './LanguageModal.css';

function LanguageModal({ isOpen, onClose }) {
  const { language, changeLanguage, t } = useLanguage();
  const { user } = useAuth();

  const handleLanguageSelect = async (selectedLanguage) => {
    changeLanguage(selectedLanguage);
    
    // Update user language in backend if user is logged in
    if (user) {
      try {
        await axios.put('http://localhost:5000/api/user/language', {
          language: selectedLanguage
        });
      } catch (error) {
        console.error('Failed to update language:', error);
      }
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="language-modal-overlay">
      <div className="language-modal">
        <div className="language-modal-header">
          <h3>{t('select_language')}</h3>
        </div>
        
        <div className="language-modal-content">
          <p>{t('language_message')}</p>
          
          <div className="language-options">
            <button 
              className={`language-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageSelect('en')}
            >
              <div className="language-flag">🇺🇸</div>
              <span>{t('english')}</span>
            </button>
            
            <button 
              className={`language-option ${language === 'hi' ? 'active' : ''}`}
              onClick={() => handleLanguageSelect('hi')}
            >
              <div className="language-flag">🇮🇳</div>
              <span>{t('hindi')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguageModal;