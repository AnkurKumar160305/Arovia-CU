import { useState } from 'react';
import Docwomen from '../assets/image/docwomen (1).png';

function About() {
  const [activeTab, setActiveTab] = useState('Vision');

  const tabs = ['Vision', 'Mission', 'Strategy'];
  
  const tabContent = {
    Vision: "Aliquam faucibus, odio nec commodo aliquam, neque felis placerat dui, a porta ante lectus dapibus est. Aliquam a bibendum mi, sed condimentum",
    Mission: "Our mission is to provide exceptional healthcare services and ensure the well-being of our patients through innovative medical solutions and compassionate care.",
    Strategy: "We implement strategic approaches to healthcare delivery, focusing on technology integration, patient-centered care, and continuous improvement in medical practices."
  };

  const aboutItems = [
    "Sonsectetur adipisicing elit",
    "Exercitation ullamco laboris",
    "Eiusmod tempor incididunt",
    "Aolore magna aliqua"
  ];

  return (
    <section className="section about" aria-labelledby="about-label">
      <div className="container">
        <div className="about-content">
          <p className="section-subtitle title-lg has-after" id="about-label" data-reveal="left">
            About Us
          </p>

          <h2 className="headline-md" data-reveal="left">Experienced Workers</h2>

          <p className="section-text" data-reveal="left">
            Aliquam faucibus, odio nec commodo aliquam, neque felis placerat dui, a porta ante lectus dapibus est. Aliquam
          </p>

          <ul className="tab-list" data-reveal="left">
            {tabs.map((tab) => (
              <li key={tab}>
                <button 
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>

          <p className="tab-text" data-reveal="left">
            {tabContent[activeTab]}
          </p>

          <div className="wrapper">
            <ul className="about-list">
              {aboutItems.map((item, index) => (
                <li key={index} className="about-item" data-reveal="left">
                  <ion-icon name="checkmark-circle-outline"></ion-icon>
                  <span className="span">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <figure className="about-banner" data-reveal="right">
          <img 
            src={Docwomen} 
            width="554" 
            height="678" 
            loading="lazy" 
            alt="about banner"
            className="w-100"
          />
        </figure>
      </div>
    </section>
  );
}

export default About;