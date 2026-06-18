import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TurnosForm.css";

export default function TurnoForm({ onSubmit, initialData, trabajadorId }) {
  const [diaInicio, setDiaInicio] = useState(initialData?.diaInicio || new Date());
  const [diaFin, setDiaFin] = useState(initialData?.diaFin || new Date());
  const [horaInicio, setHoraInicio] = useState(initialData?.horaInicio || "");
  const [horaFin, setHoraFin] = useState(initialData?.horaFin || "");
  const [minutosDescanso, setMinutosDescanso] = useState(initialData?.minutosDescanso || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(trabajadorId, {
      diaInicio,
      diaFin,
      horaInicio,
      horaFin,
      minutosDescanso,
    });
  };

  return (
    <form className="turno-form" onSubmit={handleSubmit}>
      <label>Día de inicio</label>
      <Calendar onChange={setDiaInicio} value={new Date(diaInicio)} />

      <label>Día de fin</label>
      <Calendar onChange={setDiaFin} value={new Date(diaFin)} />

      <div className="form-row">
        <label>Hora Inicio</label>
        <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
      </div>

      <div className="form-row">
        <label>Hora Fin</label>
        <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} required />
      </div>

      <div className="form-row">
        <label>Minutos Descanso</label>
        <input
          type="number"
          min="0"
          value={minutosDescanso}
          onChange={(e) => setMinutosDescanso(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary">
        {initialData ? "Actualizar turno" : "Crear turno"}
      </button>
    </form>
  );
}
