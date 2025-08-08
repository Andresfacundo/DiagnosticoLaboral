import React, { useEffect, useState, useRef } from "react";
import './ListaTurnos.css';
import { FaUserCircle, FaSearch, FaEraser } from "react-icons/fa";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import del from "../../../assets/delete.png";
import editar from '../../../assets/editar.svg';
import filtrar from '../../../assets/filtrar.svg';
import quitarFiltro from '../../../assets/quitarFiltro.svg';

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
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!mostrarFiltros) return;
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMostrarFiltros(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };



  }, [mostrarFiltros]);

  const handleFiltroChange = (setterFunction, value) => {
    setterFunction(value);
    setTimeout(() => setMostrarFiltros(false), 100);
  };


  const formatearFecha = (fechaString) => {
    if (!fechaString) return '-';
    try {
      const fecha = new Date(fechaString + 'T00:00:00');
      return format(fecha, "dd/MMM/yyyy", { locale: es }).replace('.', '').toLowerCase();
    } catch (error) {
      return fechaString;
    }
  };

  const getEmpleado = id => empleados.find(e => e.id === id);

  const eliminarTurno = id => {
    const nuevosTurnos = turnos.filter(t => t.id !== id);
    setTurnos(nuevosTurnos);
    localStorage.setItem("turnos", JSON.stringify(nuevosTurnos));
  };
  const guardarEdicionTurno = () => {
    const nuevosTurnos = turnos.map(t =>
      t.id === turnoEditando.id ? turnoEditando : t
    );
    setTurnos(nuevosTurnos);
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


  useEffect(() => {
    const filtrados = turnos.filter(turno => {
      const emp = getEmpleado(turno.empleadoId) || {};
      const nombreCompleto = `${emp.nombre || ""} ${emp.apellido || ""}`.toLowerCase();
      const area = (emp.area || "").toLowerCase();
      const documento = emp.cc || "";
      const fecha = turno.diaInicio || "";

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
  }, [filtroNombre, filtroArea, filtroDocumento, fechaDesde, fechaHasta, turnos]);


  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroArea("");
    setFiltroDocumento("");
    setFechaDesde("");
    setFechaHasta("");
    setTurnosFiltrados(turnos);
    setMostrarFiltros(false);
  };

  // Carga inicial
  useEffect(() => {
    const empleadosGuardados = localStorage.getItem("empleados");
    const turnosGuardados = localStorage.getItem("turnos");
    setEmpleados(empleadosGuardados ? JSON.parse(empleadosGuardados) : []);
    setTurnos(turnosGuardados ? JSON.parse(turnosGuardados) : []);
  }, [actualizar]);


  const nombresUnicos = Array.from(
    new Set(
      turnos.map(t => {
        const emp = getEmpleado(t.empleadoId) || {};
        return `${emp.nombre || ""} ${emp.apellido || ""}`.trim();
      })
    )
  ).filter(n => n);

  const areasUnicas = Array.from(
    new Set(
      turnos.map(t => {
        const emp = getEmpleado(t.empleadoId) || {};
        return emp.area || "";
      })
    )
  ).filter(a => a);

  // Render
  return (
    <div className="turnos-section-card">
      {/* <h2>Lista de Turnos</h2> */}
      <button className="btn-imprimir" onClick={() => window.print()}>
        Generar PDF
      </button>
      <div className="filtros-calendario">
        <div className="filtros-calendario-header">
          <span className="filtros-calendario-titulo">Filtros</span>
          <span>
            <button type="button" onClick={() => setMostrarFiltros((v) => !v)}>
              <img src={filtrar} alt="filtro" />
            </button>
          </span>
        </div>
        {mostrarFiltros && (
          <div className="filtros-dropdown" ref={modalRef}>
            <div className="filtros-calendario-container" >
              <div className="filtros-calendario-box">
                <select
                  value={filtroNombre}
                  onChange={e => handleFiltroChange(setFiltroNombre, e.target.value)}
                >
                  <option value="">Todos los nombres</option>
                  {nombresUnicos.map(nombre => (
                    <option key={nombre} value={nombre}>{nombre}</option>
                  ))}
                </select>
                <select
                  value={filtroArea}
                  onChange={e => handleFiltroChange(setFiltroArea, e.target.value)}
                >
                  <option value="">Todas las áreas</option>
                  {areasUnicas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Filtrar por documento"
                  value={filtroDocumento}
                  onChange={e => setFiltroDocumento(e.target.value)}
                />
              </div>
            </div>
            <div className="filtros-calendario-fechas">
              <input
                type="date"
                placeholder="Desde"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
              <input
                type="date"
                placeholder="Hasta"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button type="button" onClick={limpiarFiltros} className="btn-limpiar-filtros">
                <img src={quitarFiltro} alt="Quitar filtros" style={{ marginRight: 6 }} />
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
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
          {turnosFiltrados
            .slice() // Para no mutar el estado original
            .sort((a, b) => {
              // Ordena por fecha de inicio ascendente
              if (a.diaInicio < b.diaInicio) return -1;
              if (a.diaInicio > b.diaInicio) return 1;
              // Si tienen la misma fecha, puedes ordenar por horaInicio si lo deseas
              if (a.horaInicio && b.horaInicio) {
                return a.horaInicio.localeCompare(b.horaInicio);
              }
              return 0;
            })
            .map(turno => {
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
                  <td data-label="Fecha">{formatearFecha(turno.diaInicio)}</td>
                  <td data-label="Fecha">{formatearFecha(turno.diaFin)}</td>
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