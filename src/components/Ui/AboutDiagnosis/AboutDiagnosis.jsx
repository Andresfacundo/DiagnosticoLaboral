import React from 'react';
import './AboutDiagnosis.css';
import fondo from '../../../assets/backGround.png'

const AboutDiagnosis = () => {

  const team = [
    { letter: 'J', name: 'Juan daniel', role: 'Socio' },
    { letter: 'S', name: 'Santiago aristizábal', role: 'Socio' },
    { letter: 'M', name: 'María Gómez', role: 'Socio' },
    { letter: 'M', name: 'Ejemplo', role: 'Socio' },
    { letter: 'M', name: 'Ejemplo', role: 'Socio' },
    { letter: 'M', name: 'Ejemplo', role: 'Socio' },

  ];

  return (
    <section className="about-diagnosis">
      <div className="about-diagnosis-content">
        <div className="content-nosotros">
          <h2>Nosotros</h2>
          <p>¡Conoce quienes hacen parte de Gómez Valencia!</p>
        </div>

      </div>

      <section className='about-diagnosis-team-section'>
        <div className="about-diagnosis-team">
          <img src={fondo} alt="" />
          <div className="team-member">
            <h2>Juan Daniel Valencia Echeverry</h2>
            <h2>Socio</h2>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id
              commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima
              repudiandae culpa laborum ducimus. Quisquam, quidem, atque. Doloremque, aspernatur. Expedita, voluptatum. 
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id
              commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima
              repudiandae culpa laborum ducimus. Quisquam, quidem, atque. Doloremque, aspernatur. Expedita, voluptatum. 
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id
              commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima
              repudiandae culpa laborum ducimus. Quisquam, quidem, atque. Doloremque, aspernatur. Expedita, voluptatum. 
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id
              commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima
              repudiandae culpa laborum ducimus. Quisquam, quidem, atque. Doloremque, aspernatur. Expedita, voluptatum. 
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id            
            </p>
          </div>
        </div>
        <div className='team-members'>
          {team.map((member, index) => (
            <div key={index} className="team-member-card">
              <div className="team-member-image">
                <img src={fondo} alt={member.name} className="team-member-photo" />
                <div className="team-member-overlay">
                  <span className="team-member-name">{member.name}</span>
                  <p className="team-member-role">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default AboutDiagnosis;
