import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import TurnoModal from "../../Ui/TurnoModal/TurnoModal";
import { trabajadorService } from "../../../Services/api";
import { turnosFetch } from "../../../Services/useFetchTurnos";
import { toast } from "react-toastify";
import "./CalendarioTurnos.css";

import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import filtrar from "../../../assets/filtrar.svg"
import Filtros from "../../Ui/Filtros/Filtros";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

function dividirTurnoRaw(t) {
  // aseguro diaFin fallback
  const diaFin = t.diaFin || t.diaInicio;

  const start = new Date(`${t.diaInicio}T${t.horaInicio}`);
  let end = new Date(`${diaFin}T${t.horaFin}`);

  // Si end <= start -> cruza medianoche => sumo 1 día a end
  if (end <= start) {
    end = new Date(end);
    end.setDate(end.getDate() + 1);
  }

  // Si el evento queda en dos fechas distintas => dividir
  if (start.toDateString() !== end.toDateString()) {
    const finPrimerDia = new Date(start);
    finPrimerDia.setHours(0, 0, 0, 0);

    const inicioSegundoDia = new Date(end);
    inicioSegundoDia.setHours(0, 0, 0, 0);

    return [
      {
        id: `${t.id}`,
        originalId: t.id,
        title: `${t.Trabajador?.nombre || "Sin asignar"} ${t.Trabajador?.apellido || "Sin asignar"}`,
        start,
        end: finPrimerDia,
        trabajadorId: t.trabajadorId,
        _part: 1,
        _raw: t,
      },
      {
        id: `${t.id}`,
        originalId: t.id,
        title: `${t.Trabajador?.nombre || "Sin asignar"} ${t.Trabajador?.apellido || "Sin asignar"}`,
        start: inicioSegundoDia,
        end,
        trabajadorId: t.trabajadorId,
        _part: 2,
        _raw: t,
      },
    ];
  }

  // Si no cruza, solo un evento
  return [
    {
      id: String(t.id),
      originalId: t.id,
      title: `${t.Trabajador?.nombre || "Sin asignar"} ${t.Trabajador?.apellido || "Sin asignar"}`,
      start,
      end,
      trabajadorId: t.trabajadorId,
      _part: 0,
      _raw: t,
    },
  ];
}

export default function CalendarioTurnos() {
  const [rawTurnos, setRawTurnos] = useState([]);
  // turnos = lista que se pasa al calendar (posiblemente dividida)
  const [turnos, setTurnos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({
    nombre: "",
    apellido: "",
    area: "",
    cc: "",
    diaInicio: "",
    diaFin: ""
  });

  const campos = [
    { nombre: "nombre", tipo: "text", placeholder: "Nombre" },
    { nombre: "apellido", tipo: "text", placeholder: "Apellido" },
    { nombre: "area", tipo: "text", placeholder: "Área" },
    { nombre: "cc", tipo: "text", placeholder: "Documento" },
    { nombre: "diaInicio", tipo: "date", placeholder: "Día inicio" },
    { nombre: "diaFin", tipo: "date", placeholder: "Día fin" },
  ];

  const cargarDatos = async (filtrosOpcionales = {}) => {
    try {
      const [trabData, turnosData] = await Promise.all([
        trabajadorService.listar(),
        turnosFetch.listar(filtrosOpcionales),
      ]);

      setTrabajadores(trabData || []);
      setRawTurnos(turnosData || []);

      // proceso y divido los turnos para mostrarlos en el calendar
      const procesados = (turnosData || []).flatMap((t) => dividirTurnoRaw(t));
      setTurnos(procesados);
    } catch (err) {
      toast.error("Error al cargar datos");
      console.error(err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Al seleccionar un slot vacío -> crear nuevo turno
  const handleSelectSlot = ({ start, end }) => {
    setTurnoSeleccionado({
      diaInicio: format(start, "yyyy-MM-dd"),
      diaFin: format(end, "yyyy-MM-dd"),
      horaInicio: format(start, "HH:mm"),
      horaFin: format(end, "HH:mm"),
      minutosDescanso: 0,
      inicioDescanso: "",
      trabajadorId: "",
      isNew: true,
    });
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    const originalId = event.originalId ?? (String(event.id).split("-")[0] || event.id);

    // busco en rawTurnos por id (rawTurnos vienen del backend)
    const raw = rawTurnos.find((r) => String(r.id) === String(originalId));
    if (raw) {
      // preparo el objeto que espera el modal (igual que cuando vino del backend)
      setTurnoSeleccionado({ ...raw, isNew: false });
    } else {
      // fallback: usar el propio event
      setTurnoSeleccionado({ ...event, isNew: false });
    }
    setModalOpen(true);
  };

  const handleSaveTurno = async (turnoData) => {
    try {
      if (turnoData.isNew) {
        // crear
        await turnosFetch.crear(turnoData.trabajadorId, turnoData);
        toast.success("Turno creado");
      } else {
        // editar por id original
        await turnosFetch.editar(turnoData.id, turnoData);
        toast.success("Turno actualizado");
      }
      setModalOpen(false);
      setTurnoSeleccionado(null);
      await cargarDatos();
    } catch (err) {
      console.error("Error al guardar:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Error al guardar turno");
    }
  };

  const handleDeleteTurno = async (id) => {
    try {
      // eliminar por id original
      await turnosFetch.eliminar(id);
      toast.success("Turno eliminado");
      setModalOpen(false);
      setTurnoSeleccionado(null);
      await cargarDatos();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar el turno");
    }
  };

  // Cuando se arrastra/reescribe un fragmento, debemos editar el turno ORIGINAL
  const handleEventDrop = async ({ event, start, end }) => {
    try {
      // identifico original id (prop puesta en dividirTurnoRaw)
      const originalId = event.originalId ?? (String(event.id).split("-")[0] || event.id);

      // obtengo raw original para mantener campos no enviados desde el calendar
      const raw = rawTurnos.find((r) => String(r.id) === String(originalId));
      if (!raw) throw new Error("Turno original no encontrado");

      const updated = {
        ...raw,
        diaInicio: format(start, "yyyy-MM-dd"),
        diaFin: format(end, "yyyy-MM-dd"),
        horaInicio: format(start, "HH:mm"),
        horaFin: format(end, "HH:mm"),
      };

      await turnosFetch.editar(originalId, updated);
      toast.success("Turno reprogramado");
      await cargarDatos();
    } catch (err) {
      console.error("Error mover turno:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Error al mover turno");
    }
  };

  // Cuando redimensionan (cambian duración) -> idem a drop
  const handleEventResize = async ({ event, start, end }) => {
    try {
      const originalId = event.originalId ?? (String(event.id).split("-")[0] || event.id);
      const raw = rawTurnos.find((r) => String(r.id) === String(originalId));
      if (!raw) throw new Error("Turno original no encontrado");

      const updated = {
        ...raw,
        diaInicio: format(start, "yyyy-MM-dd"),
        diaFin: format(end, "yyyy-MM-dd"),
        horaInicio: format(start, "HH:mm"),
        horaFin: format(end, "HH:mm"),
      };

      await turnosFetch.editar(originalId, updated);
      toast.success("Duración del turno actualizada");
      await cargarDatos();
    } catch (err) {
      console.error("Error resize turno:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Error al actualizar duración");
    }
  };

  return (
    <div className="calendario-wrapper">
      <div className="container-imprimir-calendario">
        <button onClick={() => window.print()}>Generar PDF</button>
        <Filtros
          titulo="Filtros"
          campos={campos}
          filtros={filtros}
          setFiltros={setFiltros}
          onAplicar={(f) => cargarDatos(f)}
          onLimpiar={() => {
            const vacios = {
              nombre: "",
              apellido: "",
              area: "",
              cc: "",
              diaInicio: "",
              diaFin: "",
            };
            setFiltros(vacios)
            cargarDatos({})
          }}
        />
      </div>

      <DnDCalendar
        localizer={localizer}
        events={turnos}
        startAccessor="start"
        endAccessor="end"
        draggableAccessor={() => true}
        resizableAccessor={() => true}
        style={{ height: 1100 }}
        selectable
        resizable
        views={["month", "week", "day"]}
        defaultView="week"
        popup
        culture="es"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        eventPropGetter={(event) => {
          const trabajador = trabajadores.find((e) => e.id === event.trabajadorId);
          const color = trabajador?.color || "#9ca3af";
          return {
            style: {
              background: `linear-gradient(135deg, ${color}CC 0%, ${color}70 100%)`,
              borderRadius: "4px",
              color: "#000",
            },
            className: "calendario-event",
          };
        }}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
        formats={{
          timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, "hh:mm a", culture),
          eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
            `${localizer.format(start, "hh:mm a", culture)} - ${localizer.format(
              end,
              "hh:mm a",
              culture
            )}`,
        }}
      />

      {modalOpen && (
        <TurnoModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setTurnoSeleccionado(null);
          }}
          onSave={handleSaveTurno}
          onDelete={handleDeleteTurno}
          trabajadores={trabajadores}
          turnoInicial={turnoSeleccionado}
        />
      )}
    </div>
  );
}