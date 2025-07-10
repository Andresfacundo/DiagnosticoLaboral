// src/pages/NotAuthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🚫 No tienes permiso para acceder a esta página</h2>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

export default NotAuthorized;
