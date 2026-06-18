import React, { useState, useEffect } from "react";
import "./EditarTurnoModal.css";

const EditarTurnoModal = ({ turno, onClose, onSave }) => {
  const [form, setForm] = useState({
    diaInicio: "",
    diaFin: "",
    horaInicio: "",
    horaFin: "",
    inicioDescanso: "",
    minutosDescanso: "",
  });

  useEffect(() => {
    if (turno) {
      setForm({
        diaInicio: turno.diaInicio?.split("T")[0] || "",
        diaFin: turno.diaFin?.split("T")[0] || "",
        horaInicio: turno.horaInicio || "",
        horaFin: turno.horaFin || "",
        inicioDescanso: turno.inicioDescanso || "",
        minutosDescanso: turno.minutosDescanso || "",
      });
    }
  }, [turno]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(turno.id, form);
  };

  return (
    <div className="modal-overlay-turnos">
      <div className="modal-contenido">
        <h2>Editar turno</h2>

        <form onSubmit={handleSubmit} className="form-editar-turno">
          <div className="form-group-modal-turnos">
            <label>Fecha inicio:</label>
            <input
              type="date"
              name="diaInicio"
              value={form.diaInicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-modal-turnos">
            <label>Fecha fin:</label>
            <input
              type="date"
              name="diaFin"
              value={form.diaFin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-modal-turnos">
            <label>Hora inicio:</label>
            <input
              type="time"
              name="horaInicio"
              value={form.horaInicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-modal-turnos">
            <label>Hora fin:</label>
            <input
              type="time"
              name="horaFin"
              value={form.horaFin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-modal-turnos">
            <label>Inicio descanso:</label>
            <input
              type="time"
              name="inicioDescanso"
              value={form.inicioDescanso}
              onChange={handleChange}
            />
          </div>

          <div className="form-group-modal-turnos">
            <label>Minutos descanso:</label>
            <input
              type="number"
              name="minutosDescanso"
              value={form.minutosDescanso}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn-guardar">Guardar cambios</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarTurnoModal;
