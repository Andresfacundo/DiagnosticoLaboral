import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import "./CalendarioTurnos.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import del from "../../../assets/delete.png";
import getColombianHolidays from "colombian-holidays";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});
const formats = {
  timeGutterFormat: "hh:mm a",
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    localizer.format(start, "hh:mm a", culture) +
    " - " +
    localizer.format(end, "hh:mm a", culture),
  agendaTimeFormat: "hh:mm a",
};

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
    diaInicio: "",
    diaFin: "",
    horaInicio: "",
    horaFin: "",
    minutosDescanso: 0,
  });
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");


  const eventosFiltrados = eventos.filter(ev => {
    const empleado = empleados.find(e => e.id === ev.empleadoId);
    if (!empleado) return false;

    const nombreCompleto = `${empleado.nombre} ${empleado.apellido}`.toLowerCase();
    const documento = empleado.cc ? empleado.cc.toString() : "";
    const area = empleado.area ? empleado.area.toLowerCase() : "";

    // Filtros de texto
    if (filtroNombre && !nombreCompleto.includes(filtroNombre.toLowerCase())) return false;
    if (filtroDocumento && !documento.includes(filtroDocumento)) return false;
    if (filtroArea && !area.includes(filtroArea.toLowerCase())) return false;

    // Filtro de fechas
    if (filtroFechaDesde && ev.start < new Date(filtroFechaDesde)) return false;
    if (filtroFechaHasta && ev.end > new Date(filtroFechaHasta + "T23:59:59")) return false;

    return true;
  });

  const guardarTurnosEnLocalStorage = (turnos) => {
    localStorage.setItem("turnos", JSON.stringify(turnos));
  };

  const cargarEmpleados = () => {
    const empleadosGuardados = localStorage.getItem("empleados");
    if (empleadosGuardados) {
      const empleadosParseados = JSON.parse(empleadosGuardados);
      const empleadosConId = empleadosParseados.map((emp) => ({
        ...emp,
        id: String(emp.id),
      }));
      setEmpleados(empleadosConId);
    } else {
      setEmpleados([]);
    }
  };

  const esFestivo = (date) => {
    const año = date.getFullYear();
    const festivos = getColombianHolidays(año);
    const fechaStr = date.toISOString().split("T")[0];
    return festivos.includes(fechaStr);
  };

  const dayPropGetter = (date) => {
    if (esFestivo(date)) {
      return {
        style: {
          backgroundColor: "#ff0000",
        },
        className: "dia-festivo",
      };
    }
    return {};
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

  const recargarEventosDesdeLS = () => {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    const eventosFormateados = [];

    turnos.forEach((turno) => {
      const startDate = new Date(`${turno.diaInicio}T${turno.horaInicio}`);
      const endDate = new Date(`${turno.diaFin}T${turno.horaFin}`);


      // Verificar si el turno cruza la medianoche (hora fin menor que hora inicio)
      const [horaInicioHoras, horaInicioMinutos] = turno.horaInicio.split(':').map(Number);
      const [horaFinHoras, horaFinMinutos] = turno.horaFin.split(':').map(Number);
      const cruzaMedianoche = horaFinHoras < horaInicioHoras ||
        (horaFinHoras === horaInicioHoras && horaFinMinutos < horaInicioMinutos);

      if (cruzaMedianoche) {

        // Turno nocturno que cruza medianoche
        eventosFormateados.push({
          id: turno.id,
          title: getEmpleadoNombre(turno.empleadoId),
          start: startDate,
          end: endDate,
          empleadoId: turno.empleadoId,
          minutosDescanso: turno.minutosDescanso,
          resource: turno,
          // allDay: false,
        });
      } else {
        // Turno normal o que abarca múltiples días
        const current = new Date(startDate);

        while (current <= endDate) {
          const dia = format(current, "yyyy-MM-dd");

          eventosFormateados.push({
            id: turno.id,
            title: getEmpleadoNombre(turno.empleadoId),
            start: new Date(`${dia}T${turno.horaInicio}`),
            end: new Date(`${dia}T${turno.horaFin}`),
            empleadoId: turno.empleadoId,
            minutosDescanso: turno.minutosDescanso,
            resource: turno,
          });

          current.setDate(current.getDate() + 1);
        }
      }
    });

    setEventos(eventosFormateados);
  };

  useEffect(() => {
    const turnosLS = localStorage.getItem("turnos");
    if (turnosLS && empleados.length > 0) {
      recargarEventosDesdeLS();
    }
  }, [empleados]);

  const handleSelectSlot = (slotInfo) => {
    if (empleados.length === 0) {
      alert("Primero debes agregar empleados antes de crear turnos.");
      return;
    }

    const diaInicio = format(slotInfo.start, "yyyy-MM-dd");
    const diaFin = format(slotInfo.end, "yyyy-MM-dd");
    const horaInicio = format(slotInfo.start, "HH:mm");
    const horaFin = format(slotInfo.end, "HH:mm");

    setNuevoTurno({
      empleadoId: "",
      diaInicio,
      diaFin,
      horaInicio,
      horaFin,
      minutosDescanso: 0,
    });
    setTurnoSeleccionado(null);
    setModalType("create");
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setTurnoSeleccionado(event);
    setNuevoTurno({
      empleadoId: event.empleadoId,
      diaInicio: format(event.start, "yyyy-MM-dd"),
      diaFin: format(event.end, "yyyy-MM-dd"),
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

    const [horaInicioHoras, horaInicioMinutos] = nuevoTurno.horaInicio.split(':').map(Number);
    const [horaFinHoras, horaFinMinutos] = nuevoTurno.horaFin.split(':').map(Number);
    const cruzaMedianoche = horaFinHoras < horaInicioHoras ||
      (horaFinHoras === horaInicioHoras && horaFinMinutos < horaInicioMinutos);

    const nuevosTurnos = [];

    // Si cruza medianoche y día fin es igual a día inicio, sumamos 1 día automáticamente
    let diaFinReal = nuevoTurno.diaFin;
    if (cruzaMedianoche && nuevoTurno.diaFin === nuevoTurno.diaInicio) {
      const fecha = new Date(nuevoTurno.diaInicio + "T00:00");
      fecha.setDate(fecha.getDate() + 1);
      diaFinReal = format(fecha, "yyyy-MM-dd");
    }

    const start = new Date(`${nuevoTurno.diaInicio}T${nuevoTurno.horaInicio}`);
    const end = new Date(`${diaFinReal}T${nuevoTurno.horaFin}`);

    if (cruzaMedianoche) {
      nuevosTurnos.push({
        ...nuevoTurno,
        diaFin: diaFinReal,
        id: `turno_${Date.now()}`,
      });
    } else {
      const current = new Date(start);
      while (current <= end) {
        const dia = format(current, "yyyy-MM-dd");
        nuevosTurnos.push({
          ...nuevoTurno,
          diaInicio: dia,
          diaFin: dia,
          horaInicio: nuevoTurno.horaInicio,
          horaFin: nuevoTurno.horaFin,
          id: `turno_${Date.now()}_${dia}`,
        });
        current.setDate(current.getDate() + 1);
      }
    }

    // Si es edición, eliminar el anterior antes de guardar
    if (modalType === "edit" && turnoSeleccionado) {
      turnosActuales = turnosActuales.filter(
        (t) => t.id !== turnoSeleccionado.id
      );
    }

    const turnosFinales = [...turnosActuales, ...nuevosTurnos];
    guardarTurnosEnLocalStorage(turnosFinales);
    setModalOpen(false);
    recargarEventosDesdeLS();
  };


  const handleEliminarTurno = () => {
    const turnosActuales = JSON.parse(localStorage.getItem("turnos")) || [];
    const turnosActualizados = turnosActuales.filter(
      (t) => t.id !== turnoSeleccionado.id
    );
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
      diaInicio: format(start, "yyyy-MM-dd"),
      diaFin: format(end, "yyyy-MM-dd"),
      horaInicio: format(start, "HH:mm"),
      horaFin: format(end, "HH:mm"),
    });
  };

  const handleEventResize = ({ event, start, end }) => {
    actualizarTurno(event.id, {
      diaInicio: format(start, "yyyy-MM-dd"),
      diaFin: format(end, "yyyy-MM-dd"),
      horaInicio: format(start, "HH:mm"),
      horaFin: format(end, "HH:mm"),
    });
  };

  return (

    <div className="calendario-turnos-container">
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
            placeholder="Filtrar por documento"
            value={filtroDocumento}
            onChange={e => setFiltroDocumento(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por área"
            value={filtroArea}
            onChange={e => setFiltroArea(e.target.value)}
          />
        </div>
        <div className="filtros-row">
          <input
            type="date"
            placeholder="Desde"
            value={filtroFechaDesde}
            onChange={e => setFiltroFechaDesde(e.target.value)}
          />
          <input
            type="date"
            placeholder="Hasta"
            value={filtroFechaHasta}
            onChange={e => setFiltroFechaHasta(e.target.value)}
          />
        </div>
      </div>

      <DnDCalendar
        dayPropGetter={dayPropGetter}
        localizer={localizer}
        events={eventosFiltrados}
        startAccessor="start"
        endAccessor="end"
        formats={formats}
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
        eventPropGetter={(event) => {
          const empleado = empleados.find(e => e.id === event.empleadoId);
          const color = empleado?.color || "#79797960";
          return {
            style: {
              backgroundColor: color,
              
            },
            className: "calendario-event",
          };
        }}

        draggableAccessor={() => true}
        resizableAccessor={() => true}
      />

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel={
          modalType === "create" ? "Crear Turno" : "Editar Turno"
        }
        className="turno-modal"
        overlayClassName="turno-modal-overlay"
      >
        <div className="modal-header">
          <h3>{modalType === "create" ? "Crear Turno" : "Editar Turno"}</h3>
          {modalType === "edit" && (
            <button
              type="button"
              onClick={handleEliminarTurno}
              className="bttn-eliminar"
            >
              <img src={del} alt="" />
            </button>
          )}
        </div>

        <form onSubmit={handleGuardarTurno} className="turno-form">
          <div className="form-group">
            <label className="form-label">Empleado:</label>
            <select
              className="form-select"
              name="empleadoId"
              value={String(nuevoTurno.empleadoId)}
              onChange={(e) =>
                setNuevoTurno({ ...nuevoTurno, empleadoId: e.target.value })
              }
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
            <label className="form-label">Día Inicio:</label>
            <input
              type="date"
              className="form-input"
              name="diaInicio"
              value={nuevoTurno.diaInicio}
              onChange={(e) =>
                setNuevoTurno({ ...nuevoTurno, diaInicio: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Día Fin:</label>
            <input
              type="date"
              className="form-input"
              name="diaFin"
              value={nuevoTurno.diaFin}
              onChange={(e) =>
                setNuevoTurno({ ...nuevoTurno, diaFin: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hora inicio:</label>
            <input
              type="time"
              className="form-input"
              name="horaInicio"
              value={nuevoTurno.horaInicio}
              onChange={(e) =>
                setNuevoTurno({ ...nuevoTurno, horaInicio: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hora fin:</label>
            <input
              type="time"
              className="form-input"
              name="horaFin"
              value={nuevoTurno.horaFin}
              onChange={(e) =>
                setNuevoTurno({ ...nuevoTurno, horaFin: e.target.value })
              }
              required
            />
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
              onWheel={(e) => e.target.blur()}
              className="form-input"
              required
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={empleados.length === 0}
            >
              {modalType === "create" ? "Crear turno" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CalendarioTurnos;