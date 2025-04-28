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
        Este diagnóstico está diseñado para evaluar diferentes aspectos de cumplimiento de la legislación 
        laboral, incluyendo seguridad social, derecho colectivo y seguridad y salud en el trabajo.
        </p>
        
        <p>
        El cuestionario tiene 26 preguntas y tomará aproximadamente 10-15 minutos en completarse. 
        Las respuestas y la información proporcionada son confidenciales.
        </p>
        
        <h3>Instrucciones:</h3>
        
        <ul>
          <li>Responde todas las preguntas con la mayor honestidad posible</li>
          <li>
            Si no estás seguro de alguna respuesta, selecciona la opción que mejor represente tu
            situación
          </li>
          <li>Al final del cuestionario, recibirá un informe con los resultados.</li>
          <li>Puede guardar los resultados para consultarlos posteriormente.</li>
        </ul>
        
        <div className="note">
          <p>
            <strong>Nota:</strong> Esta herramienta proporciona información orientativa y no sustituye 
            el asesoramiento legal profesional. Si requiere asesoría, puede contactarnos.
          </p>
        </div>
        
        <NavLink to='form'>Iniciar diagnóstico</NavLink>
      </div>
    </div>
  );
};

export default InfoDiagnostico;