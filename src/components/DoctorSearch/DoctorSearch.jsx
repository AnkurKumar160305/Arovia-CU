import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import DoctorCard from './DoctorCard';
import './DoctorSearch.css';

function DoctorSearch({ searchParams, onClose }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    speciality: searchParams.speciality || '',
    location: searchParams.location || '',
    priceRange: 'all',
    rating: 'all',
    availability: 'all'
  });
  const { t } = useLanguage();

  // Mock doctors data - In production, this would come from your backend
  const mockDoctors = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      speciality: "Cardiologist",
      experience: 15,
      rating: 4.8,
      reviews: 245,
      consultationFee: 800,
      location: "Apollo Hospital, Delhi",
      distance: 2.5,
      image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      availability: "Available Today",
      phone: "+91-9876543210",
      qualifications: ["MBBS", "MD Cardiology", "DM Interventional Cardiology"],
      languages: ["English", "Hindi"]
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      speciality: "Gynecologist",
      experience: 12,
      rating: 4.9,
      reviews: 189,
      consultationFee: 600,
      location: "Max Hospital, Mumbai",
      distance: 3.2,
      image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      availability: "Available Tomorrow",
      phone: "+91-9876543211",
      qualifications: ["MBBS", "MS Gynecology", "Fellowship in Laparoscopy"],
      languages: ["English", "Hindi", "Marathi"]
    },
    {
      id: 3,
      name: "Dr. Amit Patel",
      speciality: "Orthopedic",
      experience: 18,
      rating: 4.7,
      reviews: 312,
      consultationFee: 900,
      location: "Fortis Hospital, Bangalore",
      distance: 1.8,
      image: "https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      availability: "Available Today",
      phone: "+91-9876543212",
      qualifications: ["MBBS", "MS Orthopedics", "Fellowship in Joint Replacement"],
      languages: ["English", "Hindi", "Gujarati"]
    },
    {
      id: 4,
      name: "Dr. Sunita Reddy",
      speciality: "Pediatrician",
      experience: 10,
      rating: 4.6,
      reviews: 156,
      consultationFee: 500,
      location: "Rainbow Children's Hospital, Hyderabad",
      distance: 4.1,
      image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      availability: "Available Today",
      phone: "+91-9876543213",
      qualifications: ["MBBS", "MD Pediatrics", "Fellowship in Neonatology"],
      languages: ["English", "Hindi", "Telugu"]
    },
    {
      id: 5,
      name: "Dr. Vikram Singh",
      speciality: "Neurologist",
      experience: 20,
      rating: 4.9,
      reviews: 278,
      consultationFee: 1200,
      location: "AIIMS, Delhi",
      distance: 5.3,
      image: "https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      availability: "Available Tomorrow",
      phone: "+91-9876543214",
      qualifications: ["MBBS", "MD Neurology", "DM Neurology", "Fellowship in Stroke Medicine"],
      languages: ["English", "Hindi", "Punjabi"]
    },
    {
      id: 6,
      name: "Dr. Meera Joshi",
      speciality: "Dermatologist",
      experience: 8,
      rating: 4.5,
      reviews: 134,
      consultationFee: 700,
      location: "Skin & Hair Clinic, Pune",
      distance: 2.9,
      image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1",
      availability: "Available Today",
      phone: "+91-9876543215",
      qualifications: ["MBBS", "MD Dermatology", "Fellowship in Cosmetic Dermatology"],
      languages: ["English", "Hindi", "Marathi"]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filteredDoctors = mockDoctors;

      // Filter by speciality
      if (filters.speciality && filters.speciality !== '') {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.speciality.toLowerCase().includes(filters.speciality.toLowerCase())
        );
      }

      // Filter by location
      if (filters.location && filters.location !== '') {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Filter by price range
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.consultationFee >= min && doctor.consultationFee <= max
        );
      }

      // Filter by rating
      if (filters.rating !== 'all') {
        const minRating = parseFloat(filters.rating);
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.rating >= minRating
        );
      }

      // Filter by availability
      if (filters.availability !== 'all') {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.availability.toLowerCase().includes(filters.availability.toLowerCase())
        );
      }

      // Sort by distance
      filteredDoctors.sort((a, b) => a.distance - b.distance);

      setDoctors(filteredDoctors);
      setLoading(false);
    }, 1000);
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <div className="doctor-search-overlay">
      <div className="doctor-search-container">
        <div className="doctor-search-header">
          <h2>{t('find_doctors_near_you')}</h2>
          <button className="close-search-btn" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <label>{t('choose_location')}</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder={t('choose_location')}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>{t('select_speciality')}</label>
            <select
              value={filters.speciality}
              onChange={(e) => handleFilterChange('speciality', e.target.value)}
              className="filter-select"
            >
              <option value="">{t('all_specialities')}</option>
              <option value="cardiologist">Cardiologist</option>
              <option value="gynecologist">Gynecologist</option>
              <option value="orthopedic">Orthopedic</option>
              <option value="pediatrician">Pediatrician</option>
              <option value="neurologist">Neurologist</option>
              <option value="dermatologist">Dermatologist</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="filter-select"
            >
              <option value="all">{t('all_prices')}</option>
              <option value="0-500">₹0 - ₹500</option>
              <option value="500-800">₹500 - ₹800</option>
              <option value="800-1200">₹800 - ₹1200</option>
              <option value="1200-2000">₹1200+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="filter-select"
            >
              <option value="all">{t('all_ratings')}</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="today">{t('available_today')}</option>
              <option value="tomorrow">{t('available_tomorrow')}</option>
            </select>
          </div>
        </div>

        <div className="search-results">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t('finding_doctors')}</p>
            </div>
          ) : doctors.length > 0 ? (
            <>
              <div className="results-header">
                <h3>{doctors.length} {t('doctors_found')}</h3>
                <p>{t('sorted_by_distance')}</p>
              </div>
              <div className="doctors-grid">
                {doctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <ion-icon name="search-outline"></ion-icon>
              <h3>{t('no_doctors_found')}</h3>
              <p>{t('try_adjusting_filters')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorSearch;