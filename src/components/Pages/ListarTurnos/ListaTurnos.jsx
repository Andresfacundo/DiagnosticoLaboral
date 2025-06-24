import React, { useEffect, useState } from "react";
import './ListaTurnos.css';
import { FaUserCircle } from "react-icons/fa";

function ListaTurnos({ actualizar }) {
  const [turnos, setTurnos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const getEmpleado = id => empleados.find(e => e.id === id);

  useEffect(() => {
    const empleadosGuardados = localStorage.getItem("empleados");
    const turnosGuardados = localStorage.getItem("turnos");

    if (empleadosGuardados) {
      setEmpleados(JSON.parse(empleadosGuardados));
    } else {
      setEmpleados([]);
    }

    if (turnosGuardados) {
      setTurnos(JSON.parse(turnosGuardados));
    } else {
      setTurnos([]);
    }
  }, [actualizar]);

  // Filtrado de turnos según los filtros
  const turnosFiltrados = turnos.filter(turno => {
    const emp = getEmpleado(turno.empleadoId) || {};
    const nombreCompleto = `${emp.nombre || ""} ${emp.apellido || ""}`.toLowerCase();
    const area = (emp.area || "").toLowerCase();
    const fecha = (turno.dia || "").toLowerCase();

    return (
      nombreCompleto.includes(filtroNombre.toLowerCase()) &&
      area.includes(filtroArea.toLowerCase()) &&
      fecha.includes(filtroFecha.toLowerCase())
    );
  });

  return (
    <div className="turnos-section-card">
      <h2>Lista de Turnos</h2>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={filtroNombre}
          onChange={e => setFiltroNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por área"
          value={filtroArea}
          onChange={e => setFiltroArea(e.target.value)}
        />
        <input
          type="date"
          placeholder="Filtrar por fecha"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
        />
      </div>

      <table className="lista-turnos-table">
        <thead>
          <tr>
            <th>Empleado</th>
            <th>CC</th>
            <th>Área</th>
            <th>Fecha</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Minutos Descanso</th>
          </tr>
        </thead>
        <tbody>
          {turnosFiltrados.map(turno => {
            const emp = getEmpleado(turno.empleadoId) || {};
            return (
              <tr key={turno.id}>
                <td data-label="Empleado">
                  <span className="empleado-icon"><FaUserCircle /></span>
                  {emp.nombre} {emp.apellido}
                </td>
                <td data-label="CC">{emp.cc}</td>
                <td data-label="Área">{emp.area}</td>
                <td data-label="Fecha">{turno.dia}</td>
                <td data-label="Hora Inicio">{turno.horaInicio}</td>
                <td data-label="Hora Fin">{turno.horaFin}</td>
                <td data-label="Minutos Descanso">{turno.minutosDescanso}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ListaTurnos;