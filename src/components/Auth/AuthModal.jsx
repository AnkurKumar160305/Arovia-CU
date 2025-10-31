import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useLanguage } from '../../context/LanguageContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>{mode === 'login' ? t('login') : t('signup')}</h2>
          <button className="auth-modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="auth-modal-content">
          {mode === 'login' ? (
            <LoginForm onClose={onClose} />
          ) : (
            <SignupForm onClose={onClose} />
          )}
          
          <div className="auth-modal-switch">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  className="auth-switch-btn" 
                  onClick={() => setMode('signup')}
                >
                  {t('signup')}
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  className="auth-switch-btn" 
                  onClick={() => setMode('login')}
                >
                  {t('login')}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;