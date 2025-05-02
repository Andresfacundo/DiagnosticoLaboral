import React, { useState } from 'react';
import './InfoDiagnostico.css';
import { NavLink } from 'react-router-dom';

const InfoDiagnostico = () => {

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="container">
      <h2>Diagnóstico Laboral</h2>
      
      <div className="card">
        <h3 className="info-title">Información importante antes de comenzar</h3>
        
        <p>
        Este diagnóstico está diseñado para evaluar diferentes aspectos de cumplimiento de la legislación 
        laboral, incluyendo seguridad social, derecho colectivo y seguridad y salud en el trabajo.
        </p>
        
        <p>
        El cuestionario tiene 26 preguntas y tomará aproximadamente 10-15 minutos en completarse. 
        Las respuestas y la información proporcionada son confidenciales.
        </p>
        
        <h3>Instrucciones:</h3>
        
        <ul>
          <li>Responda todas las preguntas con la mayor honestidad posible.</li>
          <li>
          Si no está seguro de alguna respuesta, seleccione la opción que mejor represente su situación.
          </li>
          <li>Al final del cuestionario, recibirá un informe con los resultados.</li>
        </ul>
        
        <div className="note">
          <p>
            <strong>Nota:</strong> Esta herramienta proporciona información orientativa y no sustituye el asesoramiento legal profesional. Si requiere asesoría, puede contactarnos.
          </p>
        </div>
        <div className='content-policy'>
          <div className='checkbox-policy'>
            <input type="checkbox"
            id='policyCheck'
            checked={isChecked}
            onChange={handleCheckboxChange}
            />
            <label htmlFor="policyCheck">
              He leído la <a href="/politica-datos" target="_blank" rel="noopener noreferrer">Política de tratamiento de datos personales</a> y autorizo el tratamiento de mis datos con base en la política.
            </label>
          </div>        
          <NavLink
            to={isChecked ? 'form' : '#'}
            className={`start-btn ${!isChecked ? 'disabled' : ''}`}
            onClick={(e) => {
              if (!isChecked) e.preventDefault();
            }}
          >
            Iniciar diagnóstico
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default InfoDiagnostico;