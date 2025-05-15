import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cargando.css';

const Cargando = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/login');
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="cargando">
      <div className="spinning"></div>
      <p>Cargando...</p>
    </div>
  );
};

export default Cargando;
