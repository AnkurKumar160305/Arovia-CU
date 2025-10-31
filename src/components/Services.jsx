import Psychiatry from '../assets/image/Psychiatry.png';
import Gynecology from '../assets/image/Gynecology.png';
import Pulmonology from '../assets/image/Pulmonology.png';
import Orthopedics from '../assets/image/Orthopedics.png';

function Services() {
  const services = [
    {
      icon: Psychiatry,
      title: "Psychiatry",
      description: "Medical specialty treating mental disorders through diagnosis, therapy, medication, and holistic approaches for patients' mental well-being and functionality."
    },
    {
      icon: Gynecology,
      title: "Gynecology",
      description: "Medical specialty focusing on female reproductive health, including diagnosis, treatment, and prevention of gynecological conditions and diseases."
    },
    {
      icon: Pulmonology,
      title: "Pulmonology",
      description: "Pulmonology is a medical specialty focused on the diagnosis and treatment of diseases affecting the respiratory system, including lungs and airways."
    },
    {
      icon: Orthopedics,
      title: "Orthopedics",
      description: "Orthopedics is a medical specialty focused on treating musculoskeletal conditions, including fractures, joint disorders, and sports injuries, through surgery and rehabilitation."
    }
  ];

  return (
    <section className="service" aria-label="service">
      <div className="container">
        <ul className="service-list">
          {services.map((service, index) => (
            <li key={index}>
              <div className="service-card" data-reveal="bottom">
                <div className="card-icon">
                  <img 
                    src={service.icon} 
                    width="71" 
                    height="71" 
                    loading="lazy" 
                    alt="icon"
                  />
                </div>

                <h3 className="headline-sm card-title">
                  <a href="#">{service.title}</a>
                </h3>

                <p className="card-text">
                  {service.description}
                </p>

                <button className="btn-circle" aria-label={`read more about ${service.title}`}>
                  <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Services;