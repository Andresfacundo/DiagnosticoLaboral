import React, { useEffect, useState } from "react";
import './ListaTurnos.css';
import { FaUserCircle, FaSearch, FaEraser } from "react-icons/fa";
import { format } from "date-fns";
import del from "../../../assets/delete.png";
import editar from '../../../assets/editar.svg';

function ListaTurnos({ actualizar }) {
  const [turnos, setTurnos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [turnosFiltrados, setTurnosFiltrados] = useState([]);
  const [turnoEditando, setTurnoEditando] = useState(null);

  // Utilidades
  const getEmpleado = id => empleados.find(e => e.id === id);

  // CRUD
  const eliminarTurno = id => {
    const nuevosTurnos = turnos.filter(t => t.id !== id);
    setTurnos(nuevosTurnos);
    setTurnosFiltrados(nuevosTurnos);
    localStorage.setItem("turnos", JSON.stringify(nuevosTurnos));
  };

  const guardarEdicionTurno = () => {
    const nuevosTurnos = turnos.map(t =>
      t.id === turnoEditando.id ? turnoEditando : t
    );
    setTurnos(nuevosTurnos);
    setTurnosFiltrados(nuevosTurnos);
    localStorage.setItem("turnos", JSON.stringify(nuevosTurnos));
    setTurnoEditando(null);
  };

  // Cálculo de horas trabajadas
  function calcularHorasTrabajadas(turno) {
    if (!turno.horaInicio || !turno.horaFin) return "";
    const [hIni, mIni] = turno.horaInicio.split(":").map(Number);
    const [hFin, mFin] = turno.horaFin.split(":").map(Number);
    const inicio = new Date(0, 0, 0, hIni, mIni);
    const fin = new Date(0, 0, 0, hFin, mFin);
    let diffMs = fin - inicio;
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
    const minutosTrabajados = diffMs / 60000 - parseInt(turno.minutosDescanso || 0);
    const horas = Math.floor(minutosTrabajados / 60);
    const minutos = minutosTrabajados % 60;
    return `${horas}h ${minutos}min`;
  }

  // Filtros
  const filtrarTurnos = () => {
    const filtrados = turnos.filter(turno => {
      const emp = getEmpleado(turno.empleadoId) || {};
      const nombreCompleto = `${emp.nombre || ""} ${emp.apellido || ""}`.toLowerCase();
      const area = (emp.area || "").toLowerCase();
      const fecha = turno.diaInicio || "";
      const documento = emp.cc || "";

      let cumpleFecha = true;
      if (fechaDesde && fecha < fechaDesde) cumpleFecha = false;
      if (fechaHasta && fecha > fechaHasta) cumpleFecha = false;

      return (
        nombreCompleto.includes(filtroNombre.toLowerCase()) &&
        area.includes(filtroArea.toLowerCase()) &&
        documento.toString().includes(filtroDocumento) &&
        cumpleFecha
      );
    });
    setTurnosFiltrados(filtrados);
  };

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroArea("");
    setFiltroDocumento("");
    setFechaDesde("");
    setFechaHasta("");
    setTurnosFiltrados(turnos);
  };

  // Carga inicial
  useEffect(() => {
    const empleadosGuardados = localStorage.getItem("empleados");
    const turnosGuardados = localStorage.getItem("turnos");
    setEmpleados(empleadosGuardados ? JSON.parse(empleadosGuardados) : []);
    setTurnos(turnosGuardados ? JSON.parse(turnosGuardados) : []);
  }, [actualizar]);

  // Actualiza turnos filtrados cuando cambian los turnos
  useEffect(() => {
    setTurnosFiltrados(turnos);
  }, [turnos]);

  // Render
  return (
    <div className="turnos-section-card">
      <h2>Lista de Turnos</h2>
      <button className="btn-imprimir" onClick={() => window.print()}>
        Generar PDF
      </button>

      <div className="filtros-turnos-agrupados">
        <span className="filtros-titulo">Filtros</span>
        <div className="filtros-row">
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
            type="text"
            placeholder="Filtrar por documento"
            value={filtroDocumento}
            onChange={e => setFiltroDocumento(e.target.value)}
          />

        </div>
        <div className="filtros-row">
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
      </div>

      {/* Tabla de turnos */}
      <table className="lista-turnos-table">
        <thead>
          <tr>
            <th>Empleado</th>
            <th>CC</th>
            <th>Área</th>
            <th>Fecha inicio</th>
            <th>Fecha fin</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Minutos Descanso</th>
            <th>Horas Trabajadas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnosFiltrados.map(turno => {
            const emp = getEmpleado(turno.empleadoId) || {};
            const horasTrabajadas = calcularHorasTrabajadas(turno);
            return (
              <tr key={turno.id}>
                <td data-label="Empleado">
                  <span className="empleado-icon"><FaUserCircle /></span>
                  {emp.nombre} {emp.apellido}
                </td>
                <td data-label="CC">{parseFloat(emp.cc).toLocaleString('es-CO')}</td>
                <td data-label="Área">{emp.area}</td>
                <td data-label="Fecha">{turno.diaInicio}</td>
                <td data-label="Fecha">{turno.diaFin}</td>
                <td data-label="Hora Inicio">
                  {turno.horaInicio
                    ? format(new Date(`2020-01-01T${turno.horaInicio}`), "hh:mm a")
                    : ""}
                </td>
                <td data-label="Hora Fin">
                  {turno.horaFin
                    ? format(new Date(`2020-01-01T${turno.horaFin}`), "hh:mm a")
                    : ""}
                </td>
                <td data-label="Minutos Descanso">{turno.minutosDescanso}</td>
                <td data-label="Horas Trabajadas">{horasTrabajadas}</td>
                <td data-label="Acciones">
                  <button
                    className="btn-editar-turno"
                    onClick={() => setTurnoEditando(turno)}
                    title="Editar turno"
                  >
                    <img src={editar} alt="" />
                  </button>
                  <button
                    className="btn-eliminar-turno"
                    onClick={() => eliminarTurno(turno.id)}
                    title="Eliminar turno"
                  >
                    <img src={del} alt="btn-eliminar" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal de edición */}
      {turnoEditando && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Turno</h3>
            <label>
              Hora Inicio:
              <input
                type="time"
                value={turnoEditando.horaInicio}
                onChange={e => setTurnoEditando({ ...turnoEditando, horaInicio: e.target.value })}
              />
            </label>
            <label>
              Hora Fin:
              <input
                type="time"
                value={turnoEditando.horaFin}
                onChange={e => setTurnoEditando({ ...turnoEditando, horaFin: e.target.value })}
              />
            </label>
            <label>
              Minutos de descanso:
              <input
                type="number"
                value={turnoEditando.minutosDescanso}
                onChange={e => setTurnoEditando({ ...turnoEditando, minutosDescanso: e.target.value })}
              />
            </label>
            <div className="modal-actions">
              <button onClick={guardarEdicionTurno}>Guardar</button>
              <button onClick={() => setTurnoEditando(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaTurnos;