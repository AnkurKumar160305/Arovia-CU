import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Listing from './components/Listing';
import Blog from './components/Blog';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import LocationModal from './components/Modals/LocationModal';
import LanguageModal from './components/Modals/LanguageModal';
import HealthcareTriageBot from './components/ChatBot/HealthcareTriageBot';
import UserDashboard from './components/Dashboard/UserDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/style.css';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [navActive, setNavActive] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setLoading(false);
      document.body.classList.add('loaded');
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    // Show language modal first, then location modal
    const hasSeenLanguageModal = localStorage.getItem('hasSeenLanguageModal');
    const hasSeenLocationModal = localStorage.getItem('hasSeenLocationModal');
    
    if (!hasSeenLanguageModal) {
      setTimeout(() => {
        setLanguageModalOpen(true);
        localStorage.setItem('hasSeenLanguageModal', 'true');
      }, 1000);
    } else if (!hasSeenLocationModal) {
      setTimeout(() => {
        setLocationModalOpen(true);
        localStorage.setItem('hasSeenLocationModal', 'true');
      }, 1500);
    }
  }, []);

  useEffect(() => {
    if (navActive) {
      document.body.classList.add('nav-active');
    } else {
      document.body.classList.remove('nav-active');
    }

    return () => document.body.classList.remove('nav-active');
  }, [navActive]);

  const handleLanguageModalClose = () => {
    setLanguageModalOpen(false);
    const hasSeenLocationModal = localStorage.getItem('hasSeenLocationModal');
    if (!hasSeenLocationModal) {
      setTimeout(() => {
        setLocationModalOpen(true);
        localStorage.setItem('hasSeenLocationModal', 'true');
      }, 500);
    }
  };

  return (
    <>
      <Preloader loaded={!loading} />
      <Header navActive={navActive} setNavActive={setNavActive} />
      <main>
        <article>
          <Hero />
          <Services />
          <About />
          <Listing />
          <Blog />
        </article>
      </main>
      <Footer />
      <BackToTop />
      
      <HealthcareTriageBot showOnHomepage={true} />
      
      <LocationModal 
        isOpen={locationModalOpen} 
        onClose={() => setLocationModalOpen(false)} 
      />
      <LanguageModal 
        isOpen={languageModalOpen} 
        onClose={handleLanguageModalClose} 
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/v1/userDashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/v1/doctorDashboard" 
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/v1/adminDashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;