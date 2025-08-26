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
const HORAS_DIARIAS_MAXIMAS = 9;
const MAX_HORAS_EXTRA_DIARIAS = 2;
const MAX_HORAS_EXTRA_SEMANALES = 12;

const formatearFechaHora = (fecha, hora) => {
  if (!fecha || !hora) return '-';
  try {
    const fechaObj = new Date(`${fecha}T${hora}:00`);
    return format(fechaObj, "dd/MMM/yyyy h:mm a", { locale: es }).replace('.', '').toLowerCase();
  } catch (error) {
    return `${fecha} ${hora}`;
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

function calcularHorasExtrasPorTurno(turno) {
  const [hiH, hiM] = turno.horaInicio.split(":").map(Number);
  const [hfH, hfM] = turno.horaFin.split(":").map(Number);
  const horaInicio = hiH + hiM / 60;
  const horaFin = hfH + hfM / 60;
  const minutosDescanso = Number(turno.minutosDescanso) || 0;

  let inicioDescanso = null;
  if (turno.inicioDescanso) {
    const [hdH, hdM] = turno.inicioDescanso.split(":").map(Number);
    inicioDescanso = hdH + hdM / 60;
  }

  let inicio = horaInicio * 60;
  let fin = horaFin * 60;
  if (fin <= inicio) fin += 24 * 60;

  // Si no se especifica cuándo inicia el descanso, se asume al final del turno
  let inicioDescansoMinutos = inicioDescanso ? inicioDescanso * 60 : (fin - minutosDescanso);
  let finDescansoMinutos = inicioDescansoMinutos + minutosDescanso;

  const duracionTotal = fin - inicio;
  const tiempoTrabajado = (duracionTotal - minutosDescanso) / 60;

  return {
    tiempoTrabajado,
    inicio,
    fin,
    inicioDescansoMinutos,
    finDescansoMinutos,
    horaInicio,
    horaFin
  };
}

function calcularHorasExtrasDesdeMinuto(inicio, fin, inicioDescansoMinutos, finDescansoMinutos, minutosHastaExtra) {
  let minutosContados = 0;
  let extrasNocturnasLocal = 0;
  let extrasDiurnasLocal = 0;
  let horaInicioExtras = null;
  let horaFinExtras = null;

  for (let minuto = inicio; minuto < fin; minuto++) {
    if (minuto >= inicioDescansoMinutos && minuto < finDescansoMinutos) {
      continue;
    }

    if (minutosContados >= minutosHastaExtra) {
      const horaReal = (minuto / 60) % 24;

      if (horaInicioExtras === null) {
        const horas = Math.floor(horaReal);
        const mins = Math.round((horaReal - horas) * 60);
        horaInicioExtras = `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      }

      if (horaReal >= HORA_NOCTURNA_INICIO || horaReal < HORA_NOCTURNA_FIN) {
        extrasNocturnasLocal++;
      } else {
        extrasDiurnasLocal++;
      }
    }
    minutosContados++;
  }

  if (extrasNocturnasLocal > 0 || extrasDiurnasLocal > 0) {
    const totalMinutosExtras = extrasNocturnasLocal + extrasDiurnasLocal;
    if (horaInicioExtras) {
      const [horaInicioH, horaInicioM] = horaInicioExtras.split(':').map(Number);
      const minutosInicioExtras = horaInicioH * 60 + horaInicioM;
      const minutosFinExtras = minutosInicioExtras + totalMinutosExtras;
      const horaFinReal = (minutosFinExtras / 60) % 24;
      const horasFinH = Math.floor(horaFinReal);
      const minutosFinM = Math.round((horaFinReal - horasFinH) * 60);
      horaFinExtras = `${horasFinH.toString().padStart(2, '0')}:${minutosFinM.toString().padStart(2, '0')}`;
    }
  }

  return {
    extrasNocturnas: extrasNocturnasLocal / 60,
    extrasDiurnas: extrasDiurnasLocal / 60,
    horaInicioExtras,
    horaFinExtras
  };
}

// NUEVA FUNCIÓN: Calcula TODOS los tipos de horas extras para un turno específico
function calcularHorasExtrasCompletasPorTurno(turno, empleado, horasAcumuladasSemana = 0) {
  if (empleado.esTrabajadorDireccion) return [];

  const { tiempoTrabajado, inicio, fin, inicioDescansoMinutos, finDescansoMinutos, horaInicio, horaFin } = calcularHorasExtrasPorTurno(turno);

  const registrosExtras = [];

  // PASO 1: Calcular horas extras DIARIAS (máximo 2 por día)
  const horasExtrasDiarias = Math.min(
    Math.max(0, tiempoTrabajado - HORAS_DIARIAS_MAXIMAS),
    MAX_HORAS_EXTRA_DIARIAS // Máximo legal
  );

  let horasExtraDiariasRegistradas = 0;

  if (horasExtrasDiarias > 0) {
    const minutosHastaExtraDiaria = HORAS_DIARIAS_MAXIMAS * 60;
    const { extrasNocturnas, extrasDiurnas, horaInicioExtras, horaFinExtras } =
      calcularHorasExtrasDesdeMinuto(inicio, fin, inicioDescansoMinutos, finDescansoMinutos, minutosHastaExtraDiaria);

    // Limitar a máximo 2 horas extra diarias
    const totalExtrasDiarias = extrasNocturnas + extrasDiurnas;
    let extrasNocturnasLimitadas = extrasNocturnas;
    let extrasDiurnasLimitadas = extrasDiurnas;

    if (totalExtrasDiarias > MAX_HORAS_EXTRA_DIARIAS) {
      const factor = MAX_HORAS_EXTRA_DIARIAS / totalExtrasDiarias;
      extrasNocturnasLimitadas = extrasNocturnas * factor;
      extrasDiurnasLimitadas = extrasDiurnas * factor;
    }

    horasExtraDiariasRegistradas = extrasNocturnasLimitadas + extrasDiurnasLimitadas;

    if (extrasNocturnasLimitadas > 0 || extrasDiurnasLimitadas > 0) {
      let fechaInicio = turno.diaInicio;
      let fechaFin = turno.diaFin;

      if (horaFin < horaInicio) {
        const fechaInicioObj = new Date(`${turno.diaInicio}T00:00:00`);
        const fechaFinObj = new Date(fechaInicioObj);
        fechaFinObj.setDate(fechaFinObj.getDate() + 1);
        fechaFin = fechaFinObj.toISOString().split('T')[0];
      }

      registrosExtras.push({
        empleado: `${empleado.nombre} ${empleado.apellido}`,
        cc: empleado.cc,
        area: empleado.area,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        horaInicioExtras: horaInicioExtras,
        horaFinExtras: horaFinExtras,
        fechaHoraInicio: formatearFechaHora(fechaInicio, horaInicioExtras),
        fechaHoraFin: formatearFechaHora(fechaFin, horaFinExtras),
        horasExtrasDiurnas: extrasDiurnasLimitadas.toFixed(2),
        horasExtrasNocturnas: extrasNocturnasLimitadas.toFixed(2),
        actividad: turno.actividad || 'No especificada',
        tipo: 'Diaria',
        turnoCompleto: {
          horaInicio: turno.horaInicio,
          horaFin: turno.horaFin,
          minutosDescanso: turno.minutosDescanso
        }
      });
    }
  }

  // PASO 2: Calcular horas extras SEMANALES
  // Solo las horas que NO fueron contabilizadas como extras diarias
  const horasOrdinariasDelTurno = tiempoTrabajado - horasExtraDiariasRegistradas;
  const espacioDisponibleSemanal = Math.max(0, HORAS_SEMANALES_MAXIMAS - horasAcumuladasSemana);
  const horasExtrasSemanales = Math.max(0, horasOrdinariasDelTurno - espacioDisponibleSemanal);

  if (horasExtrasSemanales > 0) {
    // Calcular desde qué minuto empiezan las extras semanales
    const minutosOrdinariosSemanal = Math.min(horasOrdinariasDelTurno, espacioDisponibleSemanal) * 60;
    const minutosExtrasDiarias = horasExtraDiariasRegistradas * 60;
    const minutosHastaExtraSemanal = minutosOrdinariosSemanal + minutosExtrasDiarias;

    const { extrasNocturnas, extrasDiurnas, horaInicioExtras, horaFinExtras } =
      calcularHorasExtrasDesdeMinuto(inicio, fin, inicioDescansoMinutos, finDescansoMinutos, minutosHastaExtraSemanal);

    if (extrasNocturnas > 0 || extrasDiurnas > 0) {
      let fechaInicio = turno.diaInicio;
      let fechaFin = turno.diaFin;

      if (horaFin < horaInicio) {
        const fechaInicioObj = new Date(`${turno.diaInicio}T00:00:00`);
        const fechaFinObj = new Date(fechaInicioObj);
        fechaFinObj.setDate(fechaFinObj.getDate() + 1);
        fechaFin = fechaFinObj.toISOString().split('T')[0];
      }

      registrosExtras.push({
        empleado: `${empleado.nombre} ${empleado.apellido}`,
        cc: empleado.cc,
        area: empleado.area,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        horaInicioExtras: horaInicioExtras,
        horaFinExtras: horaFinExtras,
        fechaHoraInicio: formatearFechaHora(fechaInicio, horaInicioExtras),
        fechaHoraFin: formatearFechaHora(fechaFin, horaFinExtras),
        horasExtrasDiurnas: extrasDiurnas.toFixed(2),
        horasExtrasNocturnas: extrasNocturnas.toFixed(2),
        actividad: turno.actividad || 'No especificada',
        tipo: 'Semanal',
        turnoCompleto: {
          horaInicio: turno.horaInicio,
          horaFin: turno.horaFin,
          minutosDescanso: turno.minutosDescanso
        }
      });
    }
  }

  return registrosExtras;
}

function calcularTodasLasHorasExtrasCorregidas(turnosFiltrados, empleado) {
  if (empleado.esTrabajadorDireccion) {
    return [];
  }

  const semanasTurnos = agruparTurnosPorSemanaYTrabajador(turnosFiltrados, empleado);
  const todosLosRegistros = [];

  for (const claveSemana in semanasTurnos) {
    let horasAcumuladasSemana = 0;

    const turnosSemana = semanasTurnos[claveSemana].sort((a, b) => {
      const fechaA = new Date(`${a.diaInicio}T${a.horaInicio}`);
      const fechaB = new Date(`${b.diaInicio}T${b.horaInicio}`);
      return fechaA - fechaB;
    });

    turnosSemana.forEach(turno => {
      const registrosDelTurno = calcularHorasExtrasCompletasPorTurno(turno, empleado, horasAcumuladasSemana);
      todosLosRegistros.push(...registrosDelTurno);

      const { tiempoTrabajado } = calcularHorasExtrasPorTurno(turno);

      // Solo contar como ordinarias las horas que no son extras diarias
      const horasExtrasDiariasDelTurno = registrosDelTurno
        .filter(reg => reg.tipo === 'Diaria')
        .reduce((sum, reg) => sum + parseFloat(reg.horasExtrasDiurnas) + parseFloat(reg.horasExtrasNocturnas), 0);

      const horasOrdinariasSemana = Math.min(
        tiempoTrabajado - horasExtrasDiariasDelTurno,
        Math.max(0, HORAS_SEMANALES_MAXIMAS - horasAcumuladasSemana)
      );

      horasAcumuladasSemana += horasOrdinariasSemana;
    });
  }

  return todosLosRegistros;
}

function RegistroHorasExtras({ actualizar }) {
  const [resumen, setResumen] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [registrosExtras, setRegistrosExtras] = useState([]);
  const [mostrarSpinner, setMostrarSpinner] = useState(true);
  const [actividadesEditables, setActividadesEditables] = useState({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const modalRef = React.useRef(null);

  const handleFiltroChange = (setterFunction, value) => {
    setterFunction(value);
    setTimeout(() => setMostrarFiltros(false), 100);
  };

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

        const todosLosRegistros = [];
        data.resumenEmpleados.forEach(empleado => {
          const registros = calcularTodasLasHorasExtrasCorregidas(empleado.detalleTurnos, empleado);
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

      const registros = calcularTodasLasHorasExtrasCorregidas(turnosFiltrados, empleado);
      todosLosRegistros.push(...registros);
    });

    const registrosFiltrados = todosLosRegistros.filter(registro => {
      const nombreCompleto = registro.empleado.toLowerCase();
      return (
        nombreCompleto.includes(filtroNombre.toLowerCase()) &&
        registro.cc.toString().includes(filtroDocumento) &&
        registro.area.toLowerCase().includes(filtroArea.toLowerCase()) &&
        (filtroTipo === "" || registro.tipo === filtroTipo)
      );
    });

    setRegistrosExtras(registrosFiltrados);

  }, [filtroNombre, filtroArea, filtroDocumento, filtroTipo, fechaDesde, fechaHasta, resumen]);

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroDocumento("");
    setFiltroArea("");
    setFiltroTipo("");
    setFechaDesde("");
    setFechaHasta("");
    setMostrarFiltros(false);

    if (resumen) {
      const todosLosRegistros = [];
      resumen.resumenEmpleados.forEach(empleado => {
        const registros = calcularTodasLasHorasExtrasCorregidas(empleado.detalleTurnos, empleado);
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
                <select
                  value={filtroTipo}
                  onChange={e => handleFiltroChange(setFiltroTipo, e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  <option value="Diaria">Horas extras diarias</option>
                  <option value="Semanal">Horas extras semanales</option>
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
              <th>Tipo</th>
              <th>Fecha y Hora Inicio</th>
              <th>Fecha y Hora Fin</th>
              <th>Horas extras diurnas</th>
              <th>Horas extras nocturnas</th>
              {/* <th>Total horas extras</th> */}
              <th>Actividad</th>
            </tr>
          </thead>
          <tbody>
            {registrosExtras.map((registro, index) => (
              <tr key={index} style={{ backgroundColor: registro.tipo === 'Diaria' ? '#f0f9ff' : '#fff7ed' }}>
                <td>{registro.empleado}</td>
                <td>{parseFloat(registro.cc).toLocaleString('es-CO')}</td>
                <td>{registro.area}</td>
                <td>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: registro.tipo === 'Diaria' ? '#e0f2fe' : '#fef3c7',
                    color: registro.tipo === 'Diaria' ? '#0c4a6e' : '#92400e'
                  }}>
                    {registro.tipo}
                  </span>
                </td>
                <td>{registro.fechaHoraInicio}</td>
                <td>{registro.fechaHoraFin}</td>
                <td>{registro.horasExtrasDiurnas}</td>
                <td>{registro.horasExtrasNocturnas}</td>
                {/* <td>{(parseFloat(registro.horasExtrasDiurnas) + parseFloat(registro.horasExtrasNocturnas)).toFixed(2)}</td> */}
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
                <td colSpan={6}>Totales</td>
                <td>
                  {registrosExtras.reduce((sum, reg) => sum + Number(reg.horasExtrasDiurnas), 0).toFixed(2)}
                </td>
                <td>
                  {registrosExtras.reduce((sum, reg) => sum + Number(reg.horasExtrasNocturnas), 0).toFixed(2)}
                </td>
                {/* <td>
                  {registrosExtras.reduce((sum, reg) => sum + Number(reg.horasExtrasDiurnas) + Number(reg.horasExtrasNocturnas), 0).toFixed(2)}
                </td> */}
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