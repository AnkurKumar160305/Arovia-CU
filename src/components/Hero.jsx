import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import DoctorSearch from './DoctorSearch/DoctorSearch';
import HomepageImg from '../assets/image/279ca-removebg-preview.png';

function Hero() {
  const [location, setLocation] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { t } = useLanguage();

  const handleLocationClick = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setIsGettingLocation(false);
          try {
            // Use a reverse geocoding service to get address
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            if (data.city && data.principalSubdivision) {
              setLocation(`${data.city}, ${data.principalSubdivision}`);
            } else if (data.locality) {
              setLocation(data.locality);
            } else {
              setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
            }
          } catch (error) {
            console.error('Failed to get address:', error);
            setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          }
        },
        (error) => {
          console.error('Location access denied:', error);
          alert(t('location_access_denied'));
          setIsGettingLocation(false);
        }
      );
    } else {
      alert(t('geolocation_not_supported'));
      setIsGettingLocation(false);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!location.trim()) {
      alert(t('please_enter_location') || 'Please enter or select your location');
      return;
    }
    
    setShowDoctorSearch(true);
  };

  return (
    <>
    <section 
      className="section hero" 
      style={{backgroundImage: "url('https://images.pexels.com/photos/5863391/pexels-photo-5863391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"}} 
      aria-label="home"
    >
      <div className="container">
        <div className="hero-content">
          <p className="hero-subtitle has-before" data-reveal="left">
            {t('welcome_message')}
          </p>

          <h1 className="headline-lg hero-title" data-reveal="left">
            {t('find_nearest_doctor')}
          </h1>

          <div className="hero-card" data-reveal="left">
            <p className="title-lg card-text">
              {t('search_doctors')}
            </p>

            <form onSubmit={handleSearch} className="wrapper">
              <div className="input-wrapper title-lg">
                <div className="location-input-group">
                <input 
                  type="text" 
                  name="location" 
                  placeholder={t('choose_location')}
                  className="input-field"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                  <button 
                    type="button" 
                    className="location-btn"
                    onClick={handleLocationClick}
                    disabled={isGettingLocation}
                    title="Get current location"
                  >
                    <ion-icon 
                      name={isGettingLocation ? "refresh-outline" : "location-outline"}
                      className={isGettingLocation ? "spinning" : ""}
                    ></ion-icon>
                  </button>
                </div>
                
                <select 
                  name="pets" 
                  id="pet-select"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                >
                  <option value=""><strong>-{t('select_speciality')}-</strong></option>
                  <option value="cardiologist">Cardiologist</option>
                  <option value="gynecologist">Gynecologist</option>
                  <option value="orthopedic">Orthopedic</option>
                  <option value="pediatrician">Pediatrician</option>
                  <option value="neurologist">Neurologist</option>
                  <option value="dermatologist">Dermatologist</option>
                  <option value="dentist">Dentist</option>
                  <option value="general-medicine">General Medicine</option>
                </select>

              </div>

              <button type="submit" className="btn has-before">
                <ion-icon name="search"></ion-icon>
                <span className="span title-md">{t('find_now')}</span>
              </button>
            </form>
          </div>
        </div>

        <figure className="hero-banner" data-reveal="right">
          <img 
            src={HomepageImg} 
            width="590" 
            height="517" 
            loading="eager" 
            alt="hero banner"
            className="w-100"
          />
        </figure>
      </div>
    </section>
    
    {showDoctorSearch && (
      <DoctorSearch
        searchParams={{ location, speciality }}
        onClose={() => setShowDoctorSearch(false)}
      />
    )}
    </>
  );
}

export default Hero;