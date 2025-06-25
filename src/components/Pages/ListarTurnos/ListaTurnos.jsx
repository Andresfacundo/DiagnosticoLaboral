import React, { useEffect, useState } from "react";
import './ListaTurnos.css';
import { FaUserCircle, FaSearch, FaEraser } from "react-icons/fa";

function ListaTurnos({ actualizar }) {
  const [turnos, setTurnos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [turnosFiltrados, setTurnosFiltrados] = useState([]);

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

  // Filtrar turnos solo al hacer clic en "Buscar"
  const filtrarTurnos = () => {
    const filtrados = turnos.filter(turno => {
      const emp = getEmpleado(turno.empleadoId) || {};
      const nombreCompleto = `${emp.nombre || ""} ${emp.apellido || ""}`.toLowerCase();
      const area = (emp.area || "").toLowerCase();
      const fecha = turno.dia || "";

      let cumpleFecha = true;
      if (fechaDesde && fecha < fechaDesde) cumpleFecha = false;
      if (fechaHasta && fecha > fechaHasta) cumpleFecha = false;

      return (
        nombreCompleto.includes(filtroNombre.toLowerCase()) &&
        area.includes(filtroArea.toLowerCase()) &&
        cumpleFecha
      );
    });
    setTurnosFiltrados(filtrados);
  };

  // Limpiar filtros y mostrar todos los turnos
  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroArea("");
    setFechaDesde("");
    setFechaHasta("");
    setTurnosFiltrados(turnos);
  };

  // Mostrar todos los turnos al cargar por primera vez o cuando cambian los turnos
  useEffect(() => {
    setTurnosFiltrados(turnos);
  }, [turnos]);

  return (
    <div className="turnos-section-card">
      <h2>Lista de Turnos</h2>

      {/* Filtros */}
      <div className="filtros-turnos">
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
          value={fechaDesde}
          onChange={e => setFechaDesde(e.target.value)}
          placeholder="Desde"
        />
        <input
          type="date"
          value={fechaHasta}
          onChange={e => setFechaHasta(e.target.value)}
          placeholder="Hasta"
        />
        <button onClick={filtrarTurnos}>
          <FaSearch style={{ marginRight: 5 }} />
          Buscar
        </button>
        <button onClick={limpiarFiltros}>
          <FaEraser style={{ marginRight: 5 }} />
          Limpiar
        </button>
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