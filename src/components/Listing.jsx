import Psychiatry from '../assets/image/Psychiatry.png';
import Gynecology from '../assets/image/Gynecology.png';
import Pulmonology from '../assets/image/Pulmonology.png';
import Orthopedics from '../assets/image/Orthopedics.png';
import Pediatrics from '../assets/image/Pediatrics.png';
import Osteology from '../assets/image/Osteology.png';
function Listing() {
  const specialists = [
    {
      icon: Psychiatry,
      title: "Psychiatry",
      subtitle: "Porta velit"
    },
    {
      icon: Gynecology,
      title: "Gynecology",
      subtitle: "Mattis augue"
    },
    {
      icon: Pulmonology,
      title: "Pulmonology",
      subtitle: "Mauris laoreet"
    },
    {
      icon: Orthopedics,
      title: "Orthopedics",
      subtitle: "Convallis vulputate"
    },
    {
      icon: Pediatrics,
      title: "Pediatrics",
      subtitle: "Posuere maecenas"
    },
    {
      icon: Osteology,
      title: "Osteology",
      subtitle: "Nisi nullam"
    }
  ];

  return (
    <section className="section listing" aria-labelledby="listing-label">
      <div className="container">
        <ul className="grid-list">
          <li>
            <p className="section-subtitle title-lg" id="listing-label" data-reveal="left">
              Doctors Listing
            </p>
            <h2 className="headline-md" data-reveal="left">Browse by specialist</h2>
          </li>

          {specialists.map((specialist, index) => (
            <li key={index}>
              <div className="listing-card" data-reveal="bottom">
                <div className="card-icon">
                  <img 
                    src={specialist.icon} 
                    width="71" 
                    height="71" 
                    loading="lazy" 
                    alt="icon"
                  />
                </div>

                <div>
                  <h3 className="headline-sm card-title">{specialist.title}</h3>
                  <p className="card-text">{specialist.subtitle}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Listing;