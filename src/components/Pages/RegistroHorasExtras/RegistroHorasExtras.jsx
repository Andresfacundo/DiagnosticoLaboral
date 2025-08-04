import React, { useEffect, useState } from "react";
import { FaSearch, FaEraser } from "react-icons/fa";
import './RegistroHorasExtras.css';
import SpinnerTimed from "../../Ui/SpinnerTimed/SpinnerTimed";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

const HORA_NOCTURNA_INICIO = 21;
const HORA_NOCTURNA_FIN = 6;
const HORAS_SEMANALES_MAXIMAS = 44;

// Función para agrupar turnos por semana
function agruparTurnosPorSemana(turnos) {
  const semanas = {};
  turnos.forEach(turno => {
    const fecha = new Date(`${turno.diaInicio}T00:00:00`);
    const inicioSemana = new Date(fecha);
    const dia = fecha.getDay();
    const offset = dia === 0 ? -6 : 1 - dia;
    inicioSemana.setDate(fecha.getDate() + offset);
    const claveSemana = inicioSemana.toISOString().split('T')[0];
    if (!semanas[claveSemana]) semanas[claveSemana] = [];
    semanas[claveSemana].push(turno);
  });
  return semanas;
}

// Función para calcular desde qué momento empiezan las horas extras
function calcularHorasExtrasDetallado(turnosFiltrados, empleado) {
  if (empleado.esTrabajadorDireccion) {
    return [];
  }

  const semanasTurnos = agruparTurnosPorSemana(turnosFiltrados);
  const registrosExtras = [];

  for (const claveSemana in semanasTurnos) {
    let horasAcumuladas = 0;
    const turnosSemana = semanasTurnos[claveSemana].sort((a, b) => {
      const fechaA = new Date(`${a.diaInicio}T${a.horaInicio}`);
      const fechaB = new Date(`${b.diaInicio}T${b.horaInicio}`);
      return fechaA - fechaB;
    });

    for (const turno of turnosSemana) {
      const [hiH, hiM] = turno.horaInicio.split(":").map(Number);
      const [hfH, hfM] = turno.horaFin.split(":").map(Number);
      const horaInicio = hiH + hiM / 60;
      const horaFin = hfH + hfM / 60;
      const minutosDescanso = Number(turno.minutosDescanso) || 0;

      // Calcular tiempo trabajado en este turno
      let inicio = horaInicio * 60;
      let fin = horaFin * 60;
      if (fin <= inicio) fin += 24 * 60;
      const duracionTotal = fin - inicio;
      const tiempoTrabajado = (duracionTotal - minutosDescanso) / 60;

      const espacioDisponible = Math.max(0, HORAS_SEMANALES_MAXIMAS - horasAcumuladas);
      const horasExcedentes = Math.max(0, tiempoTrabajado - espacioDisponible);

      if (horasExcedentes > 0) {
        // Calcular el momento exacto donde empiezan las extras
        const minutosHastaExtra = espacioDisponible * 60;
        let minutosContados = 0;
        let minutosDescansoDistribuidos = 0;
        let horaInicioExtras = null;
        let extrasNocturnas = 0;
        let extrasDiurnas = 0;

        for (let minuto = inicio; minuto < fin; minuto++) {
          const minutosTranscurridos = minuto - inicio;
          const descansoEsperado = (minutosTranscurridos / duracionTotal) * minutosDescanso;

          if (minutosDescansoDistribuidos < descansoEsperado) {
            minutosDescansoDistribuidos++;
            continue;
          }

          if (minutosContados >= minutosHastaExtra && horaInicioExtras === null) {
            // Este es el momento donde empiezan las horas extras
            const horaReal = (minuto / 60) % 24;
            const horas = Math.floor(horaReal);
            const minutos = Math.round((horaReal - horas) * 60);
            horaInicioExtras = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
          }

          if (minutosContados >= minutosHastaExtra) {
            const horaReal = (minuto / 60) % 24;
            if (horaReal >= HORA_NOCTURNA_INICIO || horaReal < HORA_NOCTURNA_FIN) {
              extrasNocturnas++;
            } else {
              extrasDiurnas++;
            }
          }
          minutosContados++;
        }

        // Calcular hora fin de las extras
        const horasExtrasTotales = (extrasNocturnas + extrasDiurnas) / 60;
        const [horaInicioH, horaInicioM] = horaInicioExtras.split(':').map(Number);
        const minutosInicioExtras = horaInicioH * 60 + horaInicioM;
        const minutosFinExtras = minutosInicioExtras + (horasExtrasTotales * 60);
        const horaFinReal = (minutosFinExtras / 60) % 24;
        const horasFinH = Math.floor(horaFinReal);
        const minutosFinM = Math.round((horaFinReal - horasFinH) * 60);
        const horaFinExtras = `${horasFinH.toString().padStart(2, '0')}:${minutosFinM.toString().padStart(2, '0')}`;

        registrosExtras.push({
          empleado: `${empleado.nombre} ${empleado.apellido}`,
          cc: empleado.cc,
          area: empleado.area,
          fechaInicio: turno.diaInicio,
          fechaFin: turno.diaFin,
          horaInicio: horaInicioExtras,
          horaFin: horaFinExtras,
          horasExtrasDiurnas: (extrasDiurnas / 60).toFixed(2),
          horasExtrasNocturnas: (extrasNocturnas / 60).toFixed(2),
          actividad: turno.actividad || 'No especificada'
        });
      }

      horasAcumuladas += Math.min(tiempoTrabajado, espacioDisponible);
    }
  }

  return registrosExtras;
}

function RegistroHorasExtras({ actualizar }) {
  const [resumen, setResumen] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [registrosExtras, setRegistrosExtras] = useState([]);
  const [mostrarSpinner, setMostrarSpinner] = useState(true);

  useEffect(() => {
    const empleadosGuardados = localStorage.getItem("empleados");
    const turnosGuardados = localStorage.getItem("turnos");

    const cargarResumen = async () => {
      try {
        const res = await fetch(`${API_URL}/api/resumen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            empleados: JSON.parse(empleadosGuardados || "[]"),
            turnos: JSON.parse(turnosGuardados || "[]")
          })
        });

        if (!res.ok) throw new Error("Error al obtener resumen");
        const data = await res.json();

        setResumen(data);

        // Generar todos los registros de horas extras
        const todosLosRegistros = [];
        data.resumenEmpleados.forEach(empleado => {
          const registros = calcularHorasExtrasDetallado(empleado.detalleTurnos, empleado);
          todosLosRegistros.push(...registros);
        });

        setRegistrosExtras(todosLosRegistros);
      } catch (error) {
        console.error("Error al cargar resumen:", error);
      } finally {
        setMostrarSpinner(false);
      }
    };

    cargarResumen();
  }, [actualizar]);

  
  
  useEffect(() => {
    if (!resumen) return;

    const todosLosRegistros = [];
    resumen.resumenEmpleados.forEach(empleado => {
      let turnosFiltrados = empleado.detalleTurnos;
      if (fechaDesde || fechaHasta) {
        turnosFiltrados = empleado.detalleTurnos.filter(turno => {
          const inicio = turno.diaInicio;
          const fin = turno.diaFin;
          if (fechaDesde && fin < fechaDesde) return false;
          if (fechaHasta && inicio > fechaHasta) return false;
          return true;
        });
      }

      const registros = calcularHorasExtrasDetallado(turnosFiltrados, empleado);
      todosLosRegistros.push(...registros);
    });

    // Aplicar filtros de empleado
    const registrosFiltrados = todosLosRegistros.filter(registro => {
      const nombreCompleto = registro.empleado.toLowerCase();
      return (
        nombreCompleto.includes(filtroNombre.toLowerCase()) &&
        registro.cc.toString().includes(filtroDocumento) &&
        registro.area.toLowerCase().includes(filtroArea.toLowerCase())
      );
    });
    
    setRegistrosExtras(registrosFiltrados);
    
  }, [filtroNombre, filtroArea, filtroDocumento, fechaDesde, fechaHasta])
  
  if (mostrarSpinner || !resumen) return <SpinnerTimed />;

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroDocumento("");
    setFiltroArea("");
    setFechaDesde("");
    setFechaHasta("");

    if (resumen) {
      const todosLosRegistros = [];
      resumen.resumenEmpleados.forEach(empleado => {
        const registros = calcularHorasExtrasDetallado(empleado.detalleTurnos, empleado);
        todosLosRegistros.push(...registros);
      });
      setRegistrosExtras(todosLosRegistros);
    }
  };

  return (
    <div className="registro-horas-extras-container">
      <button className="btn-imprimir" onClick={() => window.print()}>
        Generar PDF
      </button>

      <fieldset className="filtros">
        <legend><strong>Filtros</strong></legend>
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
        <div className="filtros-fechas-resumen">
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
          />
          <button onClick={limpiarFiltros}>
            <FaEraser style={{ marginRight: 5 }} />
            Limpiar
          </button>
        </div>
      </fieldset>

      {registrosExtras.length > 0 ? (
        <table border={1} cellPadding={4} className="registro-horas-extras-table">
          <thead>
            <tr>
              <th>Trabajador</th>
              <th>CC</th>
              <th>Área</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Hora inicio</th>
              <th>Hora Fin</th>
              <th>Horas extras diurnas</th>
              <th>Horas extras nocturnas</th>
              <th>Actividad</th>
            </tr>
          </thead>
          <tbody>
            {registrosExtras.map((registro, index) => (
              <tr key={index}>
                <td>{registro.empleado}</td>
                <td>{parseFloat(registro.cc).toLocaleString('es-CO')}</td>
                <td>{registro.area}</td>
                <td>{registro.fechaInicio}</td>
                <td>{registro.fechaFin}</td>
                <td>{registro.horaInicio ? format(new Date(`2020-01-01T${registro.horaInicio}`), "hh:mm a") : ""}</td>
                <td>{registro.horaFin ? format(new Date(`2020-01-01T${registro.horaFin}`), "hh:mm a") : ""}</td>
                <td>{registro.horasExtrasDiurnas}</td>
                <td>{registro.horasExtrasNocturnas}</td>
                <td>{registro.actividad}</td>
              </tr>
            ))}
          </tbody>
          {registrosExtras.length > 0 && (
            <tfoot>
              <tr style={{ background: "#f8fafc", fontWeight: "bold" }}>
                <td colSpan={7}>Totales</td>
                <td>
                  {registrosExtras.reduce((sum, reg) => sum + Number(reg.horasExtrasDiurnas), 0).toFixed(2)}
                </td>
                <td>
                  {registrosExtras.reduce((sum, reg) => sum + Number(reg.horasExtrasNocturnas), 0).toFixed(2)}
                </td>
                <td>-</td>
              </tr>
            </tfoot>
          )}
        </table>
      ) : (
        <div className="no-empleados">
          <p>No hay registros de horas extras disponibles con los filtros actuales.</p>
          <span>Los empleados mostrados no tienen horas extras registradas en el período seleccionado.</span>
        </div>
      )}
    </div>
  );
}

export default RegistroHorasExtras;