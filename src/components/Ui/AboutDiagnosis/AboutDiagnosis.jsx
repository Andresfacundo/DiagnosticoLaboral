import React, { useState } from 'react';
import './AboutDiagnosis.css';
import fondo from '../../../assets/backGround.png';

const AboutDiagnosis = () => {
  // Extended team data with more information
  const team = [
    { 
      id: 1,
      letter: 'M', 
      name: 'María Gómez', 
      role: 'Socio',
      description: 'Abogada bilingüe con máster en derecho tributario. Con más de ocho años de experiencia en manejo de personal; contratos civiles y comerciales; procesos de determinación de obligaciones adelantados por la Unidad Administrativa Especial de Gestión Pensional y Contribuciones Parafiscales de la Protección Social (la “UGPP”); trámites migratorios; defensa jurídica en procesos ordinarios laborales; preparación de conceptos legales y recomendaciones prácticas respecto a asuntos cotidianos en el manejo de relaciones laborales.'
    },
    { 
      id: 2,
      letter: 'J', 
      name: 'Juan Daniel Valencia Echeverry', 
      role: 'Socio',
      description: 'Abogado bilingüe especialista en derecho laboral. Con más de diez años de experiencia en manejo de personal, procesos de sustitución patronal, procesos de determinación de obligaciones adelantados por la Unidad Administrativa Especial de Gestión Pensional y Contribuciones Parafiscales de la Protección Social (la “UGPP”), trámites administrativos y sancionatorios ante el Servicio Nacional de Aprendizaje, investigación y asistencia en procesos disciplinarios; defensa jurídica en procesos ordinarios laborales y acciones de tutela en materia laboral y de seguridad social; preparación de conceptos legales y recomendaciones prácticas respecto a asuntos cotidianos en el manejo de relaciones laborales.'
    },
    { 
      id: 3,
      letter: 'S', 
      name: 'Santiago Aristizábal', 
      role: 'Socio',
      description: 'Abogado bilingüe especialista en derecho comercial. Con más de siete años de experiencia en derecho comercial, contractual, societario, urbano y civil, asesorando a empresas y particulares en la estructuración, negociación y formalización de proyectos y negocios jurídicos; elaboración de acuerdos comerciales, civiles, societarios e inmobiliarios, asegurando que cada negocio cumpla con los requisitos legales y fiscales que se alineen con las metas y estrategias de los clientes.'
    },
    { 
      id: 4,
      letter: 'D', 
      name: 'Daniela Angarita Galindo', 
      role: 'Asociada junior',
      description: 'Abogada actualmente cursando especialización de Derecho Laboral y Seguridad Social. Con más de nueve años de experiencia profesional en distintas áreas del derecho, con principal enfoque en derecho laboral.'
    },
    { 
      id: 5,
      letter: 'V', 
      name: 'Valeria Rincon Mateus', 
      role: 'Asociada junior',
      description: 'Abogada actualmente cursando especialización en Derecho Contractual. Con más de seis años de experiencia en Derecho inmobiliario, notarial, contractual y comercial.'
    },
    { 
      id: 6,
      letter: 'K', 
      name: 'Kevin Esteban Baena Ramírez', 
      role: 'Asociado junior',
      description: 'Abogado actualmente cursando especialización en Derecho Laboral y Seguridad Social. Con más de dos años de experiencia como abogado litigante en las áreas laboral y civil, así como en la gestión de procesos judiciales de la rama judicial.'
    },
    { 
      id: 7,
      letter: 'A', 
      name: 'Arlex Mauricio Vallejo Agudelo', 
      role: 'Asociado junior',
      description: 'Abogado con más de tres años de experiencia como asesor jurídico de empresas, tramites notariales y derecho inmobiliario.'
    },
    { 
      id: 8,
      letter: 'Y', 
      name: 'Yineth Tabares Torres', 
      role: 'Auxiliar de nómina',
      description: 'Auxiliar contable y estudiante de Bibliotecología. Con más de trece años de experiencia en gestión documental, procesos administrativos y gestión del talento humano.'
    },
    
    { 
      id: 9,
      letter: 'D', 
      name: 'Daniela Marulanda Morales', 
      role: 'Contadora',
      description: 'Contadora pública con más de ocho años de experiencia en la liquidación y presentación de obligaciones tributarias, estados financieros; información financiera para entes de supervisión y organismos como la DIAN, Superintendencia de Sociedades, DANE e Industria y Comercio; revisión y control de la información contable, incluyendo la validación de facturas, recibos de caja, notas contables y comprobantes de egreso.'
    },
    { 
      id: 10,
      letter: 'J', 
      name: 'Juan Sebastián Delgado Muñoz', 
      role: 'Auxiliar Contable',
      description: 'Contador público, ⁠especialista en alta gerencia, ⁠técnico en asistencia administrativa con más de dos años de experiencia en auditoría de informes financieros, análisis de datos y gestión de facturas.'
    },
    { 
      id: 11,
      letter: 'Y', 
      name: 'Yenifer Castrillón Gutiérrez', 
      role: 'Auxiliar Administrativa',
      description: 'Estudiante de Octavo semestre de Contaduría Pública con más de veinte años de experiencia en procesos de facturación, gestión de cartera, inventarios, envíos, pago a proveedores, elaboración de registros contables y conciliaciones bancarias.'
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
          <p>¡Conoce quíenes hacen parte de GVA!</p>
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