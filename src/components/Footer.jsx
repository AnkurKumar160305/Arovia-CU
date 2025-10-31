import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function Footer() {
  const [email, setEmail] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const { t } = useLanguage();

  useState(() => {
    const location = localStorage.getItem('userLocation');
    if (location) {
      setUserLocation(JSON.parse(location));
    }
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer 
      className="footer" 
      // style={{backgroundImage: "url('https://images.pexels.com/photos/5207118/pexels-photo-5207118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"}}
    >
      <div className="container">
        <div className="section footer-top">
          <div className="footer-brand" data-reveal="bottom">
            <a href="#" className="logo">
              <img src="" width="0" height="0" loading="lazy" alt=" " />
            </a>

            <ul className="contact-list has-after">
              <li className="contact-item">
                <div className="item-icon">
                  <ion-icon name="mail-open-outline"></ion-icon>
                </div>

                <div>
                  <p>
                    Main Email : <a href="mailto:xyzverma@gmail.com" className="contact-link">xyzverma@gmail.com</a>
                  </p>
                  <p>
                    Inquiries : <a href="mailto:ankitverma1@engineer.com" className="contact-link">ankitverma1@engineer.com</a>
                  </p>
                </div>
              </li>

              <li className="contact-item">
                <div className="item-icon">
                  <ion-icon name="call-outline"></ion-icon>
                </div>

                <div>
                  <p>
                    Office Telephone : <a href="tel:xxxxxxxxxx" className="contact-link">xxxxxxxxxx</a>
                  </p>
                  <p>
                    Mobile : <a href="tel:+919696409567" className="contact-link">+919696XXX567</a>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="footer-list" data-reveal="bottom">
            <p className="headline-sm footer-list-title">About Us</p>
            <p className="text">Founder</p>

            <address className="address">
              <ion-icon name="map-outline"></ion-icon>
              <span className="text">
                Ankit Verma <br />
                144402, Phagwara, Punjab
              </span>
            </address>
          </div>

          {userLocation && (
            <div className="footer-list" data-reveal="bottom">
              <p className="headline-sm footer-list-title">{t('your_location')}</p>
              {userLocation.address && (
                <p className="text">{userLocation.address}</p>
              )}
              <p className="text">
                Lat: {userLocation.latitude?.toFixed(4)}, 
                Lng: {userLocation.longitude?.toFixed(4)}
              </p>
              {userLocation.ipAddress && (
                <p className="text">
                  <strong>{t('ip_address')}:</strong> {userLocation.ipAddress}
                </p>
              )}
            </div>
          )}

          <ul className="footer-list" data-reveal="bottom">
            <li>
              <p className="headline-sm footer-list-title">Services</p>
            </li>
            <li><a href="#" className="text footer-link">Conditions</a></li>
            <li><a href="#" className="text footer-link">Listing</a></li>
            <li><a href="#" className="text footer-link">How It Works</a></li>
            <li><a href="#" className="text footer-link">What We Offer</a></li>
            <li><a href="#" className="text footer-link">Latest News</a></li>
            <li><a href="#" className="text footer-link">Contact Us</a></li>
          </ul>

          <ul className="footer-list" data-reveal="bottom">
            <li>
              <p className="headline-sm footer-list-title">Useful Links</p>
            </li>
            <li><a href="#" className="text footer-link">Conditions</a></li>
            <li><a href="#" className="text footer-link">Terms of Use</a></li>
            <li><a href="#" className="text footer-link">Our Services</a></li>
            <li><a href="#" className="text footer-link">Join as a Doctor</a></li>
            <li><a href="#" className="text footer-link">New Guests List</a></li>
            <li><a href="#" className="text footer-link">The Team List</a></li>
          </ul>

          <div className="footer-list" data-reveal="bottom">
            <p className="headline-sm footer-list-title">Subscribe</p>

            <form onSubmit={handleSubscribe} className="footer-form">
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                className="input-field title-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn has-before title-md">Subscribe</button>
            </form>

            <p className="text">
              Get the latest updates via email. Any time you may unsubscribe
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="text copyright">
            &copy; Medical Facilities 2024 | All Rights Reserved by Ankit Verma.
          </p>

          <ul className="social-list">
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-google"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-linkedin"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <ion-icon name="logo-pinterest"></ion-icon>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;