import React, { useState } from 'react';
import './AboutDiagnosis.css';
import fondo from '../../../assets/backGround.png';

const AboutDiagnosis = () => {
  // Extended team data with more information
  const team = [
    { 
      id: 1,
      letter: 'J', 
      name: 'Juan Daniel Valencia Echeverry', 
      role: 'Socio',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima repudiandae culpa laborum ducimus. Quisquam, quidem, atque. Doloremque, aspernatur. Expedita, voluptatum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima repudiandae culpa laborum ducimus. Quisquam, quidem, atque. Doloremque, aspernatur. Expedita, voluptatum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam.'
    },
    { 
      id: 2,
      letter: 'S', 
      name: 'Santiago Aristizábal', 
      role: 'Socio',
      description: 'Santiago es un profesional dedicado con amplia experiencia en el sector. Su enfoque innovador y capacidad para resolver problemas complejos lo han convertido en un miembro invaluable de nuestro equipo. Ha liderado múltiples proyectos exitosos y continúa aportando ideas frescas para el crecimiento de la empresa. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima repudiandae culpa laborum ducimus.'
    },
    { 
      id: 3,
      letter: 'M', 
      name: 'María Gómez', 
      role: 'Socio',
      description: 'Con más de una década de experiencia en el campo, María ha demostrado una excepcional capacidad para gestionar relaciones con clientes y desarrollar estrategias efectivas. Su dedicación y compromiso con la excelencia son características que definen su trabajo diario en nuestra firma. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum, vel adipisci quos itaque magni.'
    },
    { 
      id: 4,
      letter: 'M', 
      name: 'Ejemplo', 
      role: 'Socio',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima repudiandae culpa laborum ducimus. Quisquam, quidem, atque. Doloremque, aspernatur. Expedita, voluptatum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum.'
    },
    { 
      id: 5,
      letter: 'M', 
      name: 'Ejemplo', 
      role: 'Socio',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima repudiandae culpa laborum ducimus. Quisquam, quidem, atque. Doloremque, aspernatur. Expedita, voluptatum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum.'
    },
    { 
      id: 6,
      letter: 'M', 
      name: 'Ejemplo', 
      role: 'Socio',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum, vel adipisci quos itaque magni, blanditiis veniam. Sapiente minima repudiandae culpa laborum ducimus. Quisquam, quidem, atque. Doloremque, aspernatur. Expedita, voluptatum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas nisi magnam asperiores molestias id commodi illo nostrum.'
    },
  ];

  // State to keep track of the selected team member
  const [selectedMember, setSelectedMember] = useState(team[0]);

  // Handler for when a team member card is clicked
  const handleMemberClick = (member) => {
    setSelectedMember(member);
    // Scroll to the top of the page to see the selected member's details
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

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
          <img src={fondo} alt="Background" />
          <div className="team-member">
            <h2>{selectedMember.name}</h2>
            <h2>{selectedMember.role}</h2>
            <p>{selectedMember.description}</p>
          </div>
        </div>
        <div className='team-members'>
          {team.map((member) => (
            <div 
              key={member.id} 
              className={`team-member-card ${selectedMember.id === member.id ? 'selected' : ''}`}
              onClick={() => handleMemberClick(member)}
            >
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