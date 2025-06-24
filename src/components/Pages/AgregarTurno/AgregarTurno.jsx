import React, { useEffect, useState } from "react";
import './AgregarTurno.css';
const API_URL = import.meta.env.VITE_API_URL;


function AgregarTurno({ onTurnoAgregado }) {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    empleadoId: "",
    horaInicio: "",
    horaFin: "",
    minutosDescanso: ""
  });

  useEffect(() => {
    fetch(`${API_URL}/api/empleados`)
      .then(res => res.json())
      .then(setEmpleados);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch(`${API_URL}/api/turnos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({
      empleadoId: "",
      horaInicio: "",
      horaFin: "",
      minutosDescanso: ""
    });
    onTurnoAgregado();
  };

  return (
    <form onSubmit={handleSubmit} className="agregar-turno-form" >
      <h2>Agregar Turno</h2>
      <select name="empleadoId" value={form.empleadoId} onChange={handleChange} required>
        <option value="">Selecciona un empleado</option>
        {empleados.map(emp => (
          <option key={emp.id} value={emp.id}>
            {emp.nombre} {emp.apellido}
          </option>
        ))}
      </select>
      <input name="horaInicio" placeholder="Hora inicio (HH:MM)" value={form.horaInicio} onChange={handleChange} required />
      <input name="horaFin" placeholder="Hora fin (HH:MM)" value={form.horaFin} onChange={handleChange} required />
      <input name="minutosDescanso" type="number" placeholder="Minutos descanso" value={form.minutosDescanso} onChange={handleChange} required />
      <button type="submit">Agregar Turno</button>
    </form>
  );
}

export default AgregarTurno;
