// src/components/LoggingOut.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoggingOut.css'; // estilos

const LoggingOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir luego de 2 segundos
    const timeout = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="logging-out-container">
      <div className="spinner"></div>
      <p>Cerrando sesión...</p>
    </div>
  );
};

export default LoggingOut;
