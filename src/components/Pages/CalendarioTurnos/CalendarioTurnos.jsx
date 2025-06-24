// CalendarioTurnos.js
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import "./CalendarioTurnos.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomEvent from "../../Ui/CustomEvent/CustomEvent";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);
Modal.setAppElement("#root");

function CalendarioTurnos() {
  const [empleados, setEmpleados] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [modalType, setModalType] = useState("create");
  const [nuevoTurno, setNuevoTurno] = useState({
    empleadoId: "",
    dia: "",
    horaInicio: "",
    horaFin: "",
    minutosDescanso: 0,
  });

  const guardarTurnosEnLocalStorage = (turnos) => {
    localStorage.setItem("turnos", JSON.stringify(turnos));
  };

  const cargarEmpleados = () => {
    const empleadosGuardados = localStorage.getItem("empleados");
    if (empleadosGuardados) {
      const empleadosParseados = JSON.parse(empleadosGuardados);
      const empleadosConId = empleadosParseados.map((emp, index) => ({
        ...emp,
        id: emp.id || `emp_${index}_${emp.cc}`
      }));
      setEmpleados(empleadosConId);
    } else {
      setEmpleados([]);
    }
  };

  useEffect(() => {
    cargarEmpleados();
    window.addEventListener("localStorageUpdated", cargarEmpleados);
    return () => {
      window.removeEventListener("localStorageUpdated", cargarEmpleados);
    };
  }, []);

  const getEmpleadoNombre = (empleadoId) => {
    const emp = empleados.find((e) => e.id === empleadoId);
    return emp ? `${emp.nombre} ${emp.apellido}` : "Desconocido";
  };

  useEffect(() => {
    const turnosLS = localStorage.getItem("turnos");
    if (turnosLS && empleados.length > 0) {
      const turnos = JSON.parse(turnosLS);
      const eventosFormateados = turnos.map((turno) => ({
        id: turno.id,
        title: getEmpleadoNombre(turno.empleadoId),
        start: new Date(`${turno.dia}T${turno.horaInicio}`),
        end: new Date(`${turno.dia}T${turno.horaFin}`),
        empleadoId: turno.empleadoId,
        minutosDescanso: turno.minutosDescanso,
        resource: turno,
      }));
      setEventos(eventosFormateados);
    }
  }, [empleados]);

  const handleSelectSlot = (slotInfo) => {
    if (empleados.length === 0) {
      alert("Primero debes agregar empleados antes de crear turnos.");
      return;
    }

    const dia = format(slotInfo.start, "yyyy-MM-dd");
    const horaInicio = format(slotInfo.start, "HH:mm");
    const horaFin = format(slotInfo.end, "HH:mm");

    setNuevoTurno({ empleadoId: "", dia, horaInicio, horaFin, minutosDescanso: 0 });
    setTurnoSeleccionado(null);
    setModalType("create");
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setTurnoSeleccionado(event);
    setNuevoTurno({
      empleadoId: event.empleadoId,
      dia: format(event.start, "yyyy-MM-dd"),
      horaInicio: format(event.start, "HH:mm"),
      horaFin: format(event.end, "HH:mm"),
      minutosDescanso: event.minutosDescanso,
    });
    setModalType("edit");
    setModalOpen(true);
  };

  const handleGuardarTurno = (e) => {
    e.preventDefault();
    let turnosActuales = JSON.parse(localStorage.getItem("turnos")) || [];

    if (modalType === "edit" && turnoSeleccionado) {
      turnosActuales = turnosActuales.map((t) =>
        t.id === turnoSeleccionado.id ? { ...t, ...nuevoTurno } : t
      );
    } else {
      const nuevoId = `turno_${Date.now()}`;
      turnosActuales.push({ ...nuevoTurno, id: nuevoId });
    }

    guardarTurnosEnLocalStorage(turnosActuales);
    setModalOpen(false);
    setTurnoSeleccionado(null);
    setNuevoTurno({ empleadoId: "", dia: "", horaInicio: "", horaFin: "", minutosDescanso: 0 });
    recargarEventosDesdeLS();
  };

  const handleEliminarTurno = () => {
    const turnosActuales = JSON.parse(localStorage.getItem("turnos")) || [];
    const turnosActualizados = turnosActuales.filter((t) => t.id !== turnoSeleccionado.id);
    guardarTurnosEnLocalStorage(turnosActualizados);
    setModalOpen(false);
    setTurnoSeleccionado(null);
    recargarEventosDesdeLS();
  };

  const actualizarTurno = (eventId, cambios) => {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    const nuevosTurnos = turnos.map((t) =>
      t.id === eventId ? { ...t, ...cambios } : t
    );
    guardarTurnosEnLocalStorage(nuevosTurnos);
    recargarEventosDesdeLS();
  };

  const handleEventDrop = ({ event, start, end }) => {
    actualizarTurno(event.id, {
      dia: format(start, "yyyy-MM-dd"),
      horaInicio: format(start, "HH:mm"),
      horaFin: format(end, "HH:mm"),
    });
  };

  const handleEventResize = ({ event, start, end }) => {
    actualizarTurno(event.id, {
      dia: format(start, "yyyy-MM-dd"),
      horaInicio: format(start, "HH:mm"),
      horaFin: format(end, "HH:mm"),
    });
  };

  const recargarEventosDesdeLS = () => {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    const eventosFormateados = turnos.map((turno) => ({
      id: turno.id,
      title: getEmpleadoNombre(turno.empleadoId),
      start: new Date(`${turno.dia}T${turno.horaInicio}`),
      end: new Date(`${turno.dia}T${turno.horaFin}`),
      empleadoId: turno.empleadoId,
      minutosDescanso: turno.minutosDescanso,
      resource: turno,
    }));
    setEventos(eventosFormateados);
  };

  return (
    <div className="calendario-turnos-container">
      <h2 className="calendario-title">Calendario de Turnos</h2>

      <DnDCalendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        selectable
        resizable
        className="calendario-turnos"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        views={["month", "week", "day"]}
        defaultView="week"
        popup
        messages={{
          week: "Semana",
          work_week: "Semana laboral",
          day: "Día",
          month: "Mes",
          previous: "Anterior",
          next: "Siguiente",
          today: "Hoy",
          agenda: "Agenda",
          showMore: (total) => `+ Ver más (${total})`,
        }}
        culture="es"
        components={{ event: CustomEvent }}
        eventPropGetter={() => ({ className: "calendario-event" })}
        draggableAccessor={() => true}
        resizableAccessor={() => true}
      />

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel={modalType === "create" ? "Crear Turno" : "Editar Turno"}
        className="turno-modal"
        overlayClassName="turno-modal-overlay"
      >
        <div className="modal-header">
          <h3>{modalType === "create" ? "Crear Turno" : "Editar Turno"}</h3>
          {modalType === "edit" && (
            <button type="button" onClick={handleEliminarTurno} className="btn-eliminar">
              🗑️ Eliminar
            </button>
          )}
        </div>

        <form onSubmit={handleGuardarTurno} className="turno-form">
          <div className="form-group">
            <label className="form-label">Empleado:</label>
            <select
              className="form-select"
              name="empleadoId"
              value={nuevoTurno.empleadoId}
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, empleadoId: e.target.value })}
              required
            >
              <option value="">Seleccione un empleado</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} {emp.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Día: <span className="form-value">{nuevoTurno.dia}</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              Hora inicio: <span className="form-value">{nuevoTurno.horaInicio}</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              Hora fin: <span className="form-value">{nuevoTurno.horaFin}</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Minutos de descanso:</label>
            <input
              type="number"
              min={0}
              name="minutosDescanso"
              value={nuevoTurno.minutosDescanso}
              onChange={(e) =>
                setNuevoTurno({
                  ...nuevoTurno,
                  minutosDescanso: e.target.value,
                })
              }
              onWheel={e => e.target.blur()}
              className="form-input"
              required
            />
          </div>

          <div className="form-buttons">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={empleados.length === 0}>
              {modalType === "create" ? "Crear turno" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CalendarioTurnos;
