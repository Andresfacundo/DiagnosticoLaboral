import React from 'react';
import './InfoDiagnostico.css'; // Puedes crear este archivo CSS para los estilos
import { NavLink } from 'react-router-dom';

const InfoDiagnostico = () => {
  return (
    <div className="container">
      <h2>Diagnóstico Laboral</h2>
      
      <div className="card">
        <h3 className="info-title">Información importante antes de comenzar</h3>
        
        <p>
          Este diagnóstico está diseñado para evaluar diferentes aspectos de tu situación laboral,
          incluyendo condiciones de trabajo, ambiente laboral, y acceso a derechos y prestaciones.
        </p>
        
        <p>
          El cuestionario tiene 26 preguntas y tomará aproximadamente 10-15 minutos en completarse.
          Tus respuestas son confidenciales y te permitirán obtener una evaluación personalizada.
        </p>
        
        <h3>Instrucciones:</h3>
        
        <ul>
          <li>Responde todas las preguntas con la mayor honestidad posible</li>
          <li>
            Si no estás seguro de alguna respuesta, selecciona la opción que mejor represente tu
            situación
          </li>
          <li>Al final del cuestionario, recibirás un informe con los resultados y recomendaciones</li>
          <li>Puedes guardar tus resultados para consultarlos posteriormente</li>
        </ul>
        
        <div className="note">
          <p>
            <strong>Nota:</strong> Esta herramienta proporciona información orientativa y no sustituye el asesoramiento legal
            profesional. Si identificas problemas graves, te recomendamos consultar con un especialista en
            derecho laboral.
          </p>
        </div>
        
        <NavLink to='form'>Iniciar diagnóstico</NavLink>
      </div>
    </div>
  );
};

export default InfoDiagnostico;