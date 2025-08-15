import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaEraser } from "react-icons/fa";
import './RegistroHorasExtras.css';
import SpinnerTimed from "../../Ui/SpinnerTimed/SpinnerTimed";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import filtrar from '../../../assets/filtrar.svg';
import quitarFiltro from '../../../assets/quitarFiltro.svg';

const API_URL = import.meta.env.VITE_API_URL;

const HORA_NOCTURNA_INICIO = 21;
const HORA_NOCTURNA_FIN = 6;
const HORAS_SEMANALES_MAXIMAS = 44;

const formatearFecha = (fechaString) => {
  if (!fechaString) return '-';
  try {
    const fecha = new Date(fechaString + 'T00:00:00');
    return format(fecha, "dd/MMM/yyyy", { locale: es }).replace('.', '').toLowerCase();
  } catch (error) {
    return fechaString;
  }
};

function agruparTurnosPorSemanaYTrabajador(turnos, empleado) {
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

function calcularHorasExtrasPorSemana(turnosFiltrados, empleado) {
  if (empleado.esTrabajadorDireccion) {
    return [];
  }

  const semanasTurnos = agruparTurnosPorSemanaYTrabajador(turnosFiltrados, empleado);
  const registrosExtras = [];

  for (const claveSemana in semanasTurnos) {
    let horasAcumuladas = 0;
    let extrasNocturnas = 0;
    let extrasDiurnas = 0;
    let actividad = "";
    let fechaInicioSemana = claveSemana;
    let fechaFinSemana = claveSemana;
    let horaInicioExtras = "";
    let horaFinExtras = "";

    const turnosSemana = semanasTurnos[claveSemana].sort((a, b) => {
      const fechaA = new Date(`${a.diaInicio}T${a.horaInicio}`);
      const fechaB = new Date(`${b.diaInicio}T${b.horaInicio}`);
      return fechaA - fechaB;
    });

    turnosSemana.forEach(turno => {
      const [hiH, hiM] = turno.horaInicio.split(":").map(Number);
      const [hfH, hfM] = turno.horaFin.split(":").map(Number);
      const horaInicio = hiH + hiM / 60;
      const horaFin = hfH + hfM / 60;
      const minutosDescanso = Number(turno.minutosDescanso) || 0;

      let inicio = horaInicio * 60;
      let fin = horaFin * 60;
      if (fin <= inicio) fin += 24 * 60;
      const duracionTotal = fin - inicio;
      const tiempoTrabajado = (duracionTotal - minutosDescanso) / 60;

      const espacioDisponible = Math.max(0, HORAS_SEMANALES_MAXIMAS - horasAcumuladas);
      const horasExcedentes = Math.max(0, tiempoTrabajado - espacioDisponible);

      if (horasExcedentes > 0) {
        const minutosHastaExtra = espacioDisponible * 60;
        let minutosContados = 0;
        let minutosDescansoDistribuidos = 0;
        let horaInicioExtrasLocal = null;
        let extrasNocturnasLocal = 0;
        let extrasDiurnasLocal = 0;

        for (let minuto = inicio; minuto < fin; minuto++) {
          const minutosTranscurridos = minuto - inicio;
          const descansoEsperado = (minutosTranscurridos / duracionTotal) * minutosDescanso;

          if (minutosDescansoDistribuidos < descansoEsperado) {
            minutosDescansoDistribuidos++;
            continue;
          }

          if (minutosContados >= minutosHastaExtra && horaInicioExtrasLocal === null) {
            const horaReal = (minuto / 60) % 24;
            const horas = Math.floor(horaReal);
            const minutos = Math.round((horaReal - horas) * 60);
            horaInicioExtrasLocal = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
          }

          if (minutosContados >= minutosHastaExtra) {
            const horaReal = (minuto / 60) % 24;
            if (horaReal >= HORA_NOCTURNA_INICIO || horaReal < HORA_NOCTURNA_FIN) {
              extrasNocturnasLocal++;
            } else {
              extrasDiurnasLocal++;
            }
          }
          minutosContados++;
        }

        extrasNocturnas += extrasNocturnasLocal;
        extrasDiurnas += extrasDiurnasLocal;
        if (!horaInicioExtras) horaInicioExtras = horaInicioExtrasLocal;
        actividad = turno.actividad || actividad || 'No especificada';

        const horasExtrasTotales = (extrasNocturnasLocal + extrasDiurnasLocal) / 60;
        const [horaInicioH, horaInicioM] = horaInicioExtrasLocal.split(':').map(Number);
        const minutosInicioExtras = horaInicioH * 60 + horaInicioM;
        const minutosFinExtras = minutosInicioExtras + (horasExtrasTotales * 60);
        const horaFinReal = (minutosFinExtras / 60) % 24;
        const horasFinH = Math.floor(horaFinReal);
        const minutosFinM = Math.round((horaFinReal - horasFinH) * 60);
        horaFinExtras = `${horasFinH.toString().padStart(2, '0')}:${minutosFinM.toString().padStart(2, '0')}`;
      }

      horasAcumuladas += Math.min(tiempoTrabajado, espacioDisponible);
      if (turno.diaInicio < fechaInicioSemana) fechaInicioSemana = turno.diaInicio;
      if (turno.diaFin > fechaFinSemana) fechaFinSemana = turno.diaFin;
    });

    if (extrasNocturnas > 0 || extrasDiurnas > 0) {
      registrosExtras.push({
        empleado: `${empleado.nombre} ${empleado.apellido}`,
        cc: empleado.cc,
        area: empleado.area,
        fechaInicio: fechaInicioSemana,
        fechaFin: fechaFinSemana,
        horaInicio: horaInicioExtras,
        horaFin: horaFinExtras,
        horasExtrasDiurnas: (extrasDiurnas / 60).toFixed(2),
        horasExtrasNocturnas: (extrasNocturnas / 60).toFixed(2),
        actividad: actividad
      });
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
  const [actividadesEditables, setActividadesEditables] = useState({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const modalRef = React.useRef(null);


  
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

        // Generar todos los registros de horas extras agrupados por semana
        const todosLosRegistros = [];
        data.resumenEmpleados.forEach(empleado => {
          const registros = calcularHorasExtrasPorSemana(empleado.detalleTurnos, empleado);
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

      const registros = calcularHorasExtrasPorSemana(turnosFiltrados, empleado);
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

  }, [filtroNombre, filtroArea, filtroDocumento, fechaDesde, fechaHasta, resumen]);


  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroDocumento("");
    setFiltroArea("");
    setFechaDesde("");
    setFechaHasta("");

    if (resumen) {
      const todosLosRegistros = [];
      resumen.resumenEmpleados.forEach(empleado => {
        const registros = calcularHorasExtrasPorSemana(empleado.detalleTurnos, empleado);
        todosLosRegistros.push(...registros);
      });
      setRegistrosExtras(todosLosRegistros);
    }
  };

  const guardarActividadesEnLocalStorage = (actividades) => {
    localStorage.setItem("actividadesExtras", JSON.stringify(actividades));
  };

  const cargarActividadesDeLocalStorage = () => {
    const data = localStorage.getItem("actividadesExtras");
    return data ? JSON.parse(data) : {};
  };

  useEffect(() => {
    setActividadesEditables(cargarActividadesDeLocalStorage());
  }, []);

  const handleActividadChange = (index, value) => {
    setActividadesEditables(prev => {
      const nuevas = { ...prev, [index]: value };
      guardarActividadesEnLocalStorage(nuevas);
      return nuevas;
    });
  };

  const handleActividadBlur = (index) => {
    setRegistrosExtras(prev =>
      prev.map((registro, i) =>
        i === index ? { ...registro, actividad: actividadesEditables[index] || registro.actividad } : registro
      )
    );
    guardarActividadesEnLocalStorage(actividadesEditables);
  };
  const nombresUnicos = Array.from(
    new Set(
      registrosExtras.map(registro => registro.empleado)
    )
    ).filter(n => n);

  const areasUnicas = Array.from(
    new Set(
      registrosExtras.map(registro => registro.area || "")
    )
    ).filter(a => a);
  
  if (mostrarSpinner || !resumen) return <SpinnerTimed />;

  return (
    <div className="registro-horas-extras-container">
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

      {registrosExtras.length > 0 ? (
        <table border={1} cellPadding={4} className="registro-horas-extras-table">
          <thead>
            <tr>
              <th>Trabajador</th>
              <th>CC</th>
              <th>Área</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
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
                <td>{formatearFecha(registro.fechaInicio)}</td>
                <td>{formatearFecha(registro.fechaFin)}</td>
                <td>{registro.horasExtrasDiurnas}</td>
                <td>{registro.horasExtrasNocturnas}</td>
                <td className="actividad-editable">
                  <input
                    type="text"
                    value={actividadesEditables[index] !== undefined ? actividadesEditables[index] : registro.actividad}
                    onChange={e => handleActividadChange(index, e.target.value)}
                    onBlur={() => handleActividadBlur(index)}

                  />
                </td>
              </tr>
            ))}
          </tbody>
          {registrosExtras.length > 0 && (
            <tfoot>
              <tr style={{ background: "#f8fafc", fontWeight: "bold" }}>
                <td colSpan={5}>Totales</td>
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