import React, { useState } from 'react';
import './Contacto.css';

const ContactoForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    intereses: [],
  });

  const [mensaje, setMensaje] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí llamas a tu backend o servicio de email
    console.log('Formulario enviado:', formData);

    // Simular éxito
    setMensaje('¡Formulario enviado con éxito!');
    setFormData({
      nombre: '',
      correo: '',
      telefono: '',
      intereses: [],
    });
  };

  return (
    <div className="contacto-form-container">
      <div className="contacto-info">
        <h2>¡Contáctanos!</h2>
        <h3>Somos expertos en asesoría laboral</h3>
        <p>Escríbenos y uno de nuestros consultores te contactará pronto.</p>
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

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              value="Asesoría y representación jurídica"
              checked={formData.intereses.includes('Asesoría y representación jurídica')}
              onChange={handleChange}
            />
            Asesoría y representación jurídica
          </label>
          <label>
            <input
              type="checkbox"
              value="Contratación en el sector salud"
              checked={formData.intereses.includes('Contratación en el sector salud')}
              onChange={handleChange}
            />
            Contratación en el sector salud
          </label>
          <label>
            <input
              type="checkbox"
              value="Litigios de alto impacto"
              checked={formData.intereses.includes('Litigios de alto impacto')}
              onChange={handleChange}
            />
            Litigios de alto impacto
          </label>
          <label>
            <input
              type="checkbox"
              value="Registro de Marca"
              checked={formData.intereses.includes('Registro de Marca')}
              onChange={handleChange}
            />
            Registro de Marca
          </label>
        </div>

        <button type="submit" className="btn-contactar">CONTACTAR ASESOR</button>
        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      </form>
    </div>
  );
};

export default ContactoForm;
