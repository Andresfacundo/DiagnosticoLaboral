import React, { useState, useEffect } from 'react';
import './Contacto.css';
import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;

const ContactoForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    intereses: [],
    mensaje: '',
  });
  
  const [mensaje, setMensaje] = useState('');
  const [interesesDisponibles, setInteresesDisponibles] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  }
  useEffect(() => {
    // Obtener intereses desde el backend
    const fetchIntereses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/intereses`);
        setInteresesDisponibles(res.data);
      } catch (error) {
        console.error('Error al obtener intereses:', error);
      }
    };

    fetchIntereses();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => {
        if (checked) {
          return { ...prev, intereses: [...prev.intereses, value] };
        } else {
          return { ...prev, intereses: prev.intereses.filter((i) => i !== value) };
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/contacto`, formData);
      setMensaje('¡Formulario enviado con éxito!');
      setFormData({
        nombre: '',
        correo: '',
        telefono: '',
        intereses: [],
        mensaje: '',
      });
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setMensaje('Error al enviar el formulario.');
    }

  };

  return (
    <div className="contacto-form-container">
      <div className="contacto-info">
        <h2>¡Contáctanos!</h2>
      </div>

      <form className="contacto-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="correo@email.com"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="+57 (número de celular)"
          value={formData.telefono}
          onChange={handleChange}
        />
        <textarea
          name="mensaje"
          placeholder="Mensaje..."
          value={formData.mensaje}
          onChange={handleChange}
        />
        <div className="checkbox-group">
          {interesesDisponibles.map((interes) => (
            <label key={interes.id}>
              <input
                type="checkbox"
                value={interes.nombre}
                checked={formData.intereses.includes(interes.nombre)}
                onChange={handleChange}
              />
              {interes.nombre}
            </label>
          ))}
        </div>
        <div className='box-policy'>
            <input type="checkbox"
            id='policyCheck'
            checked={isChecked}
            onChange={handleCheckboxChange}
            />
            <label htmlFor="policyCheck">
              He leído la <a href="/politica-datos" target="_blank" rel="noopener noreferrer">Política de tratamiento de datos personales</a> y autorizo el tratamiento de mis datos con base en la política.
            </label>
          </div>  


        <button type="submit" className="btn-contactar" onClick={e => {
          if(!isChecked) e.preventDefault();
        }}>Enviar</button>
        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      </form>
    </div>
  );
};

export default ContactoForm;
