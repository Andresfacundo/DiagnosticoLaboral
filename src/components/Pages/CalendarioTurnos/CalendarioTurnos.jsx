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
import filtrar from "../../../assets/filtrar.svg";
import quitarFiltro from "../../../assets/quitarFiltro.svg";
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
    `${localizer.format(start, "hh:mm a", culture)} - ${localizer.format(end, "hh:mm a", culture)}`,
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
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Función para calcular las horas trabajadas
  const calcularHorasTrabajadas = (horaInicio, horaFin, minutosDescanso = 0) => {
    const [horaInicioHoras, horaInicioMinutos] = horaInicio.split(":").map(Number);
    const [horaFinHoras, horaFinMinutos] = horaFin.split(":").map(Number);

    let totalMinutos = 0;

    // Verificar si cruza medianoche
    const cruzaMedianoche = horaFinHoras < horaInicioHoras ||
      (horaFinHoras === horaInicioHoras && horaFinMinutos < horaInicioMinutos);

    if (cruzaMedianoche) {
      // Calcular minutos hasta medianoche + minutos desde medianoche
      const minutosHastaMedianoche = (24 * 60) - (horaInicioHoras * 60 + horaInicioMinutos);
      const minutosDesdeMedianoche = horaFinHoras * 60 + horaFinMinutos;
      totalMinutos = minutosHastaMedianoche + minutosDesdeMedianoche;
    } else {
      // Cálculo normal
      totalMinutos = (horaFinHoras * 60 + horaFinMinutos) - (horaInicioHoras * 60 + horaInicioMinutos);
    }

    // Restar minutos de descanso
    totalMinutos -= parseInt(minutosDescanso) || 0;

    // Convertir a horas
    return totalMinutos / 60;
  };

  // Función para validar las horas del turno
  const validarHorasTurno = (horaInicio, horaFin, minutosDescanso) => {
    const horasTrabajadas = calcularHorasTrabajadas(horaInicio, horaFin, minutosDescanso);
    return horasTrabajadas <= 11;
  };

  const eventosFiltrados = eventos.filter(ev => {
    const empleado = empleados.find(e => e.id === ev.empleadoId);
    if (!empleado) return false;

    const nombreCompleto = `${empleado.nombre} ${empleado.apellido}`.toLowerCase();
    const documento = empleado.cc ? empleado.cc.toString() : "";
    const area = empleado.area ? empleado.area.toLowerCase() : "";

    if (filtroNombre && !nombreCompleto.includes(filtroNombre.toLowerCase())) return false;
    if (filtroDocumento && !documento.includes(filtroDocumento)) return false;
    if (filtroArea && !area.includes(filtroArea.toLowerCase())) return false;

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
        style: { backgroundColor: "#ff0000" },
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
      const [horaInicioHoras, horaInicioMinutos] = turno.horaInicio.split(":").map(Number);
      const [horaFinHoras, horaFinMinutos] = turno.horaFin.split(":").map(Number);
      const cruzaMedianoche =
        horaFinHoras < horaInicioHoras || (horaFinHoras === horaInicioHoras && horaFinMinutos < horaInicioMinutos);

      if (cruzaMedianoche) {
        eventosFormateados.push({
          id: turno.id,
          title: getEmpleadoNombre(turno.empleadoId),
          start: startDate,
          end: endDate,
          empleadoId: turno.empleadoId,
          minutosDescanso: turno.minutosDescanso,
          resource: turno,
        });
      } else {
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

  // Función para actualizar un turno existente en localStorage (sin cambiar id)
  const actualizarTurnoPorId = (turnoActualizado) => {
    let turnosActuales = JSON.parse(localStorage.getItem("turnos")) || [];
    const nuevosTurnos = turnosActuales.map((t) => (t.id === turnoActualizado.id ? turnoActualizado : t));
    guardarTurnosEnLocalStorage(nuevosTurnos);
    recargarEventosDesdeLS();
  };

  // Función para crear un id único basado en los datos, sin usar Date.now()
  const crearTurnoId = (turno) =>
    [turno.empleadoId, turno.diaInicio, turno.horaInicio, turno.diaFin, turno.horaFin].join("_");

  const handleGuardarTurno = (e) => {
    e.preventDefault();

    // Validar que las horas trabajadas no excedan las 11 horas
    if (!validarHorasTurno(nuevoTurno.horaInicio, nuevoTurno.horaFin, nuevoTurno.minutosDescanso)) {
      const horasTrabajadas = calcularHorasTrabajadas(nuevoTurno.horaInicio, nuevoTurno.horaFin, nuevoTurno.minutosDescanso);
      alert(`No se puede crear el turno. Las horas trabajadas (${horasTrabajadas.toFixed(2)} horas) exceden el máximo permitido de 11 horas.`);
      return;
    }

    if (modalType === "edit" && turnoSeleccionado) {
      // Edición: actualiza el turno existente sin cambiar id
      const turnoEditado = {
        ...turnoSeleccionado.resource, // base del turno original
        ...nuevoTurno, // datos actualizados desde el formulario
        id: turnoSeleccionado.id, // conservar mismo id
      };
      actualizarTurnoPorId(turnoEditado);
      setModalOpen(false);
      return;
    }

    // CREACIÓN de un nuevo turno (puede haber varios días)
    const turnosActuales = JSON.parse(localStorage.getItem("turnos")) || [];

    const [horaInicioHoras, horaInicioMinutos] = nuevoTurno.horaInicio.split(":").map(Number);
    const [horaFinHoras, horaFinMinutos] = nuevoTurno.horaFin.split(":").map(Number);
    const cruzaMedianoche =
      horaFinHoras < horaInicioHoras || (horaFinHoras === horaInicioHoras && horaFinMinutos < horaInicioMinutos);

    const nuevosTurnos = [];

    // Si cruza medianoche y día fin es igual al día inicio, sumamos 1 día automáticamente
    let diaFinReal = nuevoTurno.diaFin;
    if (cruzaMedianoche && nuevoTurno.diaFin === nuevoTurno.diaInicio) {
      const fecha = new Date(nuevoTurno.diaInicio + "T00:00");
      fecha.setDate(fecha.getDate() + 1);
      diaFinReal = format(fecha, "yyyy-MM-dd");
    }

    const start = new Date(`${nuevoTurno.diaInicio}T${nuevoTurno.horaInicio}`);
    const end = new Date(`${diaFinReal}T${nuevoTurno.horaFin}`);

    if (cruzaMedianoche) {
      const turnoId = crearTurnoId({ ...nuevoTurno, diaFin: diaFinReal });
      nuevosTurnos.push({
        ...nuevoTurno,
        diaFin: diaFinReal,
        id: turnoId,
      });
    } else {
      const current = new Date(start);
      while (current <= end) {
        const dia = format(current, "yyyy-MM-dd");
        const turnoId = crearTurnoId({ ...nuevoTurno, diaInicio: dia, diaFin: dia });
        nuevosTurnos.push({
          ...nuevoTurno,
          diaInicio: dia,
          diaFin: dia,
          horaInicio: nuevoTurno.horaInicio,
          horaFin: nuevoTurno.horaFin,
          id: turnoId,
        });
        current.setDate(current.getDate() + 1);
      }
    }

    const turnosFinales = [...turnosActuales, ...nuevosTurnos];
    guardarTurnosEnLocalStorage(turnosFinales);
    setModalOpen(false);
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
    const nuevosTurnos = turnos.map((t) => (t.id === eventId ? { ...t, ...cambios } : t));
    guardarTurnosEnLocalStorage(nuevosTurnos);
    recargarEventosDesdeLS();
  };

  const handleEventDrop = ({ event, start, end }) => {
    // Validar horas antes de permitir el drop
    const horaInicio = format(start, "HH:mm");
    const horaFin = format(end, "HH:mm");

    if (!validarHorasTurno(horaInicio, horaFin, event.minutosDescanso)) {
      const horasTrabajadas = calcularHorasTrabajadas(horaInicio, horaFin, event.minutosDescanso);
      alert(`No se puede mover el turno. Las horas trabajadas (${horasTrabajadas.toFixed(2)} horas) excederían el máximo permitido de 11 horas.`);
      return;
    }

    actualizarTurno(event.id, {
      diaInicio: format(start, "yyyy-MM-dd"),
      diaFin: format(end, "yyyy-MM-dd"),
      horaInicio: horaInicio,
      horaFin: horaFin,
    });
  };

  const handleEventResize = ({ event, start, end }) => {
    // Validar horas antes de permitir el resize
    const horaInicio = format(start, "HH:mm");
    const horaFin = format(end, "HH:mm");

    if (!validarHorasTurno(horaInicio, horaFin, event.minutosDescanso)) {
      const horasTrabajadas = calcularHorasTrabajadas(horaInicio, horaFin, event.minutosDescanso);
      alert(`No se puede redimensionar el turno. Las horas trabajadas (${horasTrabajadas.toFixed(2)} horas) excederían el máximo permitido de 11 horas.`);
      return;
    }

    actualizarTurno(event.id, {
      diaInicio: format(start, "yyyy-MM-dd"),
      diaFin: format(end, "yyyy-MM-dd"),
      horaInicio: horaInicio,
      horaFin: horaFin,
    });
  };

  // Función para obtener las horas trabajadas del turno actual (para mostrar en el modal)
  const getHorasTrabajadasActual = () => {
    if (nuevoTurno.horaInicio && nuevoTurno.horaFin) {
      return calcularHorasTrabajadas(nuevoTurno.horaInicio, nuevoTurno.horaFin, nuevoTurno.minutosDescanso);
    }
    return 0;
  };
  const nombresUnicos = Array.from(
    new Set(
      eventos.map(ev => {
        const emp = empleados.find(e => e.id === ev.empleadoId) || {};
        return `${emp.nombre || ""} ${emp.apellido || ""}`.trim();
      })
    )
  ).filter(n => n);

  const areasUnicas = Array.from(
    new Set(
      eventos.map(ev => {
        const emp = empleados.find(e => e.id === ev.empleadoId) || {};
        return emp.area || "";
      })
    )
  ).filter(a => a);

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroDocumento("");
    setFiltroArea("");
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
  };

  return (
    <div className="calendario-turnos-container">
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
          <div className="filtros-dropdown">
            <div className="filtros-calendario-container">
              <div className="filtros-calendario-box">
                <select
                  value={filtroNombre}
                  onChange={e => setFiltroNombre(e.target.value)}
                >
                  <option value="">Todos los nombres</option>
                  {nombresUnicos.map(nombre => (
                    <option key={nombre} value={nombre}>{nombre}</option>
                  ))}
                </select>
                <select
                  value={filtroArea}
                  onChange={e => setFiltroArea(e.target.value)}
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
                value={filtroFechaDesde}
                onChange={(e) => setFiltroFechaDesde(e.target.value)}
              />
              <input
                type="date"
                placeholder="Hasta"
                value={filtroFechaHasta}
                onChange={(e) => setFiltroFechaHasta(e.target.value)}
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
          const empleado = empleados.find((e) => e.id === event.empleadoId);
          const baseColor = empleado?.color || "#797979";
          return {
            style: {
              background: `linear-gradient(135deg, ${baseColor}CC 0%, ${baseColor}70 100%)`,
              borderRadius: "4px",
              color: "#333",
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
        contentLabel={modalType === "create" ? "Crear Turno" : "Editar Turno"}
        className="turno-modal"
        overlayClassName="turno-modal-overlay"
      >
        <div className="modal-header">
          <h3>{modalType === "create" ? "Crear Turno" : "Editar Turno"}</h3>
          {modalType === "edit" && (
            <button type="button" onClick={handleEliminarTurno} className="bttn-eliminar">
              <img src={del} alt="Eliminar turno" />
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
            <label className="form-label">Día Inicio:</label>
            <input
              type="date"
              className="form-input"
              name="diaInicio"
              value={nuevoTurno.diaInicio}
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, diaInicio: e.target.value })}
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
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, diaFin: e.target.value })}
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
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, horaInicio: e.target.value })}
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
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, horaFin: e.target.value })}
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
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, minutosDescanso: e.target.value })}
              onWheel={(e) => e.target.blur()}
              className="form-input"
              required
            />
          </div>

          {/* Mostrar las horas trabajadas calculadas */}
          {nuevoTurno.horaInicio && nuevoTurno.horaFin && (
            <div className="form-group">
              <label className="form-label">
                Horas trabajadas:
                <span style={{
                  color: getHorasTrabajadasActual() > 11 ? 'red' : 'green',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {getHorasTrabajadasActual().toFixed(2)} horas
                  {getHorasTrabajadasActual() > 11 && ' (Excede el máximo de 11 horas)'}
                </span>
              </label>
            </div>
          )}

          <div className="form-buttons">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={empleados.length === 0 || getHorasTrabajadasActual() > 11}
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