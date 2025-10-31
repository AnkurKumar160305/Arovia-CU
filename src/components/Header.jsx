import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AuthModal from './Auth/AuthModal';
import DiseaseRadarModal from './DiseaseRadar/DiseaseRadarModal';
import EmergencySOSModal from './Emergency/EmergencySOSModal';
import MedicinesModal from './Medicines/MedicinesModal';

function Header({ navActive, setNavActive }) {
  const [headerActive, setHeaderActive] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [diseaseRadarOpen, setDiseaseRadarOpen] = useState(false);
  const [emergencySOSOpen, setEmergencySOSOpen] = useState(false);
  const [medicinesOpen, setMedicinesOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHeaderActive(true);
      } else {
        setHeaderActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNav = () => {
    setNavActive(!navActive);
  };

  const handleDiseaseRadarClick = () => {
    setDiseaseRadarOpen(true);
  };

  const handleEmergencySOSClick = () => {
    setEmergencySOSOpen(true);
  };

  const handleMedicinesClick = () => {
    setMedicinesOpen(true);
  };

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setAuthModalOpen(true);
    }
  };
  return (
    <>
      <header className={`header ${headerActive ? 'active' : ''}`} data-header>
      <div className="container">
        <nav className={`navbar ${navActive ? 'active' : ''}`} data-navbar>
          <div className="navbar-top">
            <button 
              className="nav-close-btn" 
              aria-label="close menu" 
              onClick={toggleNav}
            >
              <ion-icon name="close-outline" aria-hidden="true"></ion-icon>
            </button>
          </div>

          <ul className="navbar-list">
            <li className="navbar-item">
              <a href="#" className="navbar-link title-md">{t('home')}</a>
            </li>
            <li className="navbar-item">
              <a href="#" className="navbar-link title-md">{t('doctors')}</a>
            </li>
            <li className="navbar-item">
              <a href="#" className="navbar-link title-md">{t('services')}</a>
            </li>
            <li className="navbar-item">
              <a href="#" className="navbar-link title-md">{t('medicines_products')}</a>
            </li>
            <li className="navbar-item">
              <a href="#" className="navbar-link title-md">{t('verify_medicine')}</a>
            </li>
            <li className="navbar-item">
              <a href="#" className="navbar-link title-md" target="_blank">{t('contact')}</a>
            </li>
          </ul>

          <ul className="social-list">
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-pinterest"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-youtube"></ion-icon>
              </a>
            </li>
          </ul>
        </nav>

        <button 
          className="emergency-sos-btn" 
          onClick={handleEmergencySOSClick}
          title="Emergency SOS - One-tap help"
        >
          <ion-icon name="medical-outline"></ion-icon>
          <span>SOS</span>
        </button>

        <button 
          className="disease-radar-btn" 
          onClick={handleDiseaseRadarClick}
          title="Disease Outbreak Radar"
        >
          <ion-icon name="pulse-outline"></ion-icon>
          <span className="radar-text">Disease Radar</span>
        </button>

        <button 
          className="medicines-btn" 
          onClick={handleMedicinesClick}
          title="Medicines & Products"
        >
          <ion-icon name="medical-outline"></ion-icon>
          <span>Medicines</span>
        </button>

        <button 
          className="auth-btn" 
          onClick={handleAuthClick}
        >
          {user ? t('logout') : t('login_signup')}
        </button>

        <button 
          className="nav-open-btn" 
          aria-label="open menu" 
          onClick={toggleNav}
        >
          <ion-icon name="menu-outline"></ion-icon>
        </button>

        <a href="#" className="btn has-before title-md">{t('make_appointment')}</a>

        <div 
          className={`overlay ${navActive ? 'active' : ''}`} 
          onClick={toggleNav}
          data-overlay
        ></div>
      </div>
      </header>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      
      <DiseaseRadarModal 
        isOpen={diseaseRadarOpen} 
        onClose={() => setDiseaseRadarOpen(false)} 
      />
      
      <EmergencySOSModal 
        isOpen={emergencySOSOpen} 
        onClose={() => setEmergencySOSOpen(false)} 
      />
      
      <MedicinesModal 
        isOpen={medicinesOpen} 
        onClose={() => setMedicinesOpen(false)} 
      />
    </>
  );
}

export default Header;