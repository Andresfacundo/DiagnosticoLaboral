import React from 'react';
import './AboutDiagnosis.css';

const AboutDiagnosis = () => {
  const areas = [
    {
      title: 'Condiciones laborales',
      description: 'Evalúa aspectos como contratos, salarios, jornada laboral y estabilidad en el empleo.',
    },
    {
      title: 'Ambiente laboral',
      description: 'Examina las relaciones interpersonales, la comunicación y los riesgos psicosociales.',
    },
    {
      title: 'Desarrollo profesional',
      description: 'Considera las oportunidades de formación, crecimiento y desarrollo de carrera.',
    },
    {
      title: 'Derechos y prestaciones',
      description: 'Analiza el acceso a beneficios como seguridad social, vacaciones pagadas y otros derechos legales.',
    },
    {
      title: 'Salud y seguridad',
      description: 'Valora las condiciones físicas del entorno laboral y las medidas de prevención de riesgos.',
    },
  ];

  const team = [
    { letter: 'J', name: 'Juan daniel', role: 'Socio' },
    { letter: 'S', name: 'Santiago aristizábal', role: 'Socio' },
    { letter: 'M', name: 'María Gómez', role: 'Socio' },
  ];

  return (
    <div className="diagnosis-container">
      <h2>Acerca del Diagnóstico Laboral</h2>

      <section className="section">
        <h3>Nuestra misión</h3>
        <p>
          El Diagnóstico Laboral es una herramienta diseñada para promover el conocimiento y ejercicio de los derechos laborales.
          Nuestro objetivo es brindar a los trabajadores información clara sobre su situación laboral y ofrecer recomendaciones
          para mejorar sus condiciones de trabajo.
        </p>
        <p>
          Creemos que un entorno laboral justo y saludable beneficia tanto a los trabajadores como a las empresas, fomentando
          la productividad, la satisfacción y el bienestar general.
        </p>
      </section>

      <section className="section">
        <h3>Metodología</h3>
        <p>Nuestra herramienta evalúa cinco dimensiones fundamentales del entorno laboral:</p>
        <div className="grid">
          {areas.map((area, idx) => (
            <div key={idx} className="card">
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3>Equipo</h3>
        <p>Somos un grupo interdisciplinario de profesionales comprometidos con la promoción de entornos laborales justos.</p>
        <div className="team">
          {team.map((member, idx) => (
            <div key={idx} className="member">
              <div className="circle">{member.letter}</div>
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3>Contacto</h3>
        <p>Si tienes preguntas, comentarios o sugerencias, no dudes en ponerte en contacto con nosotros.</p>
        <div className="contact">
          <strong>Email:</strong> administrativo@gomezvalencia.com
        </div>
      </section>
    </div>
  );
};

export default AboutDiagnosis;
