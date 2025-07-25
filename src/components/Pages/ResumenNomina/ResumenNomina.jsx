import React, { useEffect, useState } from "react";
import { FaSearch, FaEraser } from "react-icons/fa";
import './ResumenNomina.css';
import SpinnerTimed from "../../Ui/SpinnerTimed/SpinnerTimed";

const API_URL = import.meta.env.VITE_API_URL;

const HORA_NOCTURNA_INICIO = 21;
const HORA_NOCTURNA_FIN = 6;
const HORAS_SEMANALES_MAXIMAS = 44;

// Función para agrupar turnos por semana (igual que el backend)
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

// Función para calcular horas nocturnas (igual que el backend)
function calcularHorasNocturnas(horaInicio, horaFin, minutosDescanso = 0) {
  let inicio = horaInicio * 60;
  let fin = horaFin * 60;
  if (fin <= inicio) fin += 24 * 60;
  const duracionTotal = fin - inicio;
  let nocturnas = 0, diurnas = 0;

  for (let minuto = 0; minuto < duracionTotal; minuto++) {
    const horaReal = ((inicio + minuto) / 60) % 24;
    if (horaReal >= HORA_NOCTURNA_INICIO || horaReal < HORA_NOCTURNA_FIN) nocturnas++;
    else diurnas++;
  }

  nocturnas = nocturnas / 60;
  diurnas = diurnas / 60;
  const tiempoTrabajado = (nocturnas + diurnas) - (minutosDescanso / 60);

  return {
    horasNocturnas: Number(nocturnas.toFixed(2)),
    horasDiurnas: Number(diurnas.toFixed(2)),
    tiempoTrabajado: Number(tiempoTrabajado.toFixed(2)),
  };
}

// Función para calcular extras desde un minuto específico (igual que el backend)
function calcularHorasExtrasDesdeMinuto(horaInicio, horaFin, minutosDescanso, minutosHastaExtra) {
  let inicio = horaInicio * 60;
  let fin = horaFin * 60;
  if (fin <= inicio) fin += 24 * 60;
  
  const duracionTotal = fin - inicio;
  const tiempoSinDescanso = duracionTotal - minutosDescanso;
  
  if (minutosHastaExtra >= tiempoSinDescanso) {
    return { extrasNocturnas: 0, extrasDiurnas: 0 };
  }
  
  let extrasNocturnas = 0, extrasDiurnas = 0;
  let minutosContados = 0;
  let minutosDescansoDistribuidos = 0;
  
  for (let minuto = inicio; minuto < fin; minuto++) {
    const minutosTranscurridos = minuto - inicio;
    const descansoEsperado = (minutosTranscurridos / duracionTotal) * minutosDescanso;
    
    if (minutosDescansoDistribuidos < descansoEsperado) {
      minutosDescansoDistribuidos++;
      continue;
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

  return {
    extrasNocturnas: extrasNocturnas / 60,
    extrasDiurnas: extrasDiurnas / 60
  };
}

// Función corregida: cálculo SEMANAL de horas extras (igual que el backend)
function calcularHorasExtrasSemanales(turnosFiltrados, esTrabajadorDireccion = false) {
  if (esTrabajadorDireccion) {
    return { horasExtrasDiurnas: 0, horasExtrasNocturnas: 0 };
  }

  const semanasTurnos = agruparTurnosPorSemana(turnosFiltrados);
  let horasExtraDiurnas = 0;
  let horasExtraNocturnas = 0;

  for (const claveSemana in semanasTurnos) {
    let horasAcumuladas = 0;
    const turnosSemana = semanasTurnos[claveSemana];

    for (const turno of turnosSemana) {
      const [hiH, hiM] = turno.horaInicio.split(":").map(Number);
      const [hfH, hfM] = turno.horaFin.split(":").map(Number);
      const horaInicio = hiH + hiM / 60;
      const horaFin = hfH + hfM / 60;
      const minutosDescanso = Number(turno.minutosDescanso) || 0;

      const { tiempoTrabajado } = calcularHorasNocturnas(horaInicio, horaFin, minutosDescanso);

      const espacioDisponible = Math.max(0, HORAS_SEMANALES_MAXIMAS - horasAcumuladas);
      const horasAsignadas = Math.min(tiempoTrabajado, espacioDisponible);
      const horasExcedentes = Math.max(0, tiempoTrabajado - espacioDisponible);

      horasAcumuladas += horasAsignadas;

      if (horasExcedentes > 0) {
        const minutosHastaExtra = espacioDisponible * 60;
        const { extrasNocturnas, extrasDiurnas } = calcularHorasExtrasDesdeMinuto(
          horaInicio, horaFin, minutosDescanso, minutosHastaExtra
        );

        horasExtraNocturnas += extrasNocturnas;
        horasExtraDiurnas += extrasDiurnas;
      }
    }
  }

  return {
    horasExtrasDiurnas: horasExtraDiurnas,
    horasExtrasNocturnas: horasExtraNocturnas
  };
}

function recalcularValoresPorFecha(empleado, fechaDesdeFiltro = "", fechaHastaFiltro = "") {
  if (!fechaDesdeFiltro && !fechaHastaFiltro) {
    return empleado;
  }

  const turnosFiltrados = empleado.detalleTurnos.filter(turno => {
    const inicio = turno.diaInicio;
    const fin = turno.diaFin;
    if (fechaDesdeFiltro && fin < fechaDesdeFiltro) return false;
    if (fechaHastaFiltro && inicio > fechaHastaFiltro) return false;
    return true;
  });

  const cantidadTurnos = turnosFiltrados.length;
  const salarioHora = parseFloat(empleado.salarioHora);

  // Recalcular totales desde los turnos filtrados
  const totalHoras = turnosFiltrados.reduce((sum, turno) => sum + parseFloat(turno.tiempoTrabajado || 0), 0);
  const totalHorasFestivas = turnosFiltrados.reduce((sum, turno) => {
    return sum + (turno.esFestivo ? parseFloat(turno.tiempoTrabajado || 0) : 0);
  }, 0);

  // Calcular recargo nocturno total
  let totalHorasNocturnas = 0;
  turnosFiltrados.forEach(turno => {
    const [hiH, hiM] = turno.horaInicio.split(":").map(Number);
    const [hfH, hfM] = turno.horaFin.split(":").map(Number);
    const horaInicio = hiH + hiM / 60;
    const horaFin = hfH + hfM / 60;
    const minutosDescanso = Number(turno.minutosDescanso) || 0;

    let inicioMin = horaInicio * 60;
    let finMin = horaFin * 60;
    if (finMin <= inicioMin) finMin += 24 * 60;
    
    const duracionTotal = finMin - inicioMin;
    let recargoNocturnoTurno = 0;
    let minutosDescansoDistribuidos = 0;
    
    for (let minuto = 0; minuto < duracionTotal; minuto++) {
      const descansoEsperado = (minuto / duracionTotal) * minutosDescanso;
      if (minutosDescansoDistribuidos < descansoEsperado) {
        minutosDescansoDistribuidos++;
        continue;
      }
      
      const horaReal = ((inicioMin + minuto) / 60) % 24;
      if (horaReal >= HORA_NOCTURNA_INICIO || horaReal < HORA_NOCTURNA_FIN) {
        recargoNocturnoTurno++;
      }
    }
    totalHorasNocturnas += recargoNocturnoTurno / 60;
  });
  
  // CÁLCULO CORREGIDO: Usar lógica SEMANAL (igual que el backend)
  const { horasExtrasDiurnas, horasExtrasNocturnas } = calcularHorasExtrasSemanales(
    turnosFiltrados, 
    empleado.esTrabajadorDireccion
  );
  
  const horasExtraTotales = horasExtrasDiurnas + horasExtrasNocturnas;
  
  // Calcular recargo nocturno sin incluir horas extras nocturnas
  const horasNocturnasSinExtras = Math.max(0, totalHorasNocturnas - horasExtrasNocturnas);

  // Usar la misma lógica de cálculo que el backend
  const valores = {
    horasExtraDiurnas: empleado.esTrabajadorDireccion ? 0 : horasExtrasDiurnas * salarioHora * 1.25,
    horasExtraNocturnas: empleado.esTrabajadorDireccion ? 0 : horasExtrasNocturnas * salarioHora * 1.75,
    recargoNocturno: horasNocturnasSinExtras * salarioHora * 0.35,
    recargoFestivo: totalHorasFestivas * salarioHora * 0.80
  };

  // Usar los mismos cálculos finales que el backend
  const totalValores = Object.values(valores).reduce((sum, val) => sum + val, 0);
  const totalPagar = Math.round(totalValores * 0.92);
  const costoTotal = Math.round(totalValores * 1.3855);
  const pagoExtra = Math.round(valores.horasExtraDiurnas + valores.horasExtraNocturnas);
  const valorRecargoNocturno = Math.round(valores.recargoNocturno);
  const pagoFestivo = Math.round(valores.recargoFestivo);

  return {
    ...empleado,
    cantidadTurnos,
    totalHoras: totalHoras.toFixed(2),
    horasExtra: horasExtraTotales.toFixed(2),
    pagoExtra,
    pagoFestivo,
    totalPagar,
    costoTotal,
    horas: {
      ...empleado.horas,
      horasExtraDiurnas: horasExtrasDiurnas.toFixed(2),
      horasExtraNocturnas: horasExtrasNocturnas.toFixed(2),
      horasExtraTotales: horasExtraTotales.toFixed(2),
      recargoNocturno: horasNocturnasSinExtras.toFixed(2),
      horasFestivas: totalHorasFestivas.toFixed(2),
      totalHoras: totalHoras.toFixed(2)
    },
    valores: {
      ...empleado.valores,
      horasExtraDiurnas: Math.round(valores.horasExtraDiurnas),
      horasExtraNocturnas: Math.round(valores.horasExtraNocturnas),
      recargoNocturno: valorRecargoNocturno,
      recargoFestivo: pagoFestivo
    }
  };
}

function ResumenNomina({ actualizar }) {
  const [resumen, setResumen] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
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
        setEmpleadosFiltrados(data.resumenEmpleados.map(emp => recalcularValoresPorFecha(emp)));
      } catch (error) {
        console.error("Error al cargar resumen:", error);
      } finally {
        setMostrarSpinner(false);
      }
    };

    cargarResumen();
  }, [actualizar]);

  if (mostrarSpinner || !resumen) return <SpinnerTimed />;

  const filtrarEmpleados = () => {
    if (!resumen) return;
    const filtrados = resumen.resumenEmpleados
      .filter(emp => {
        const nombreCompleto = `${emp.nombre} ${emp.apellido}`.toLowerCase();

        let cumpleFecha = true;
        if (fechaDesde || fechaHasta) {
          cumpleFecha = emp.detalleTurnos.some(turno => {
            const inicio = turno.diaInicio;
            const fin = turno.diaFin;
            if (fechaDesde && fin < fechaDesde) return false;
            if (fechaHasta && inicio > fechaHasta) return false;
            return true;
          });
        }

        return (
          nombreCompleto.includes(filtroNombre.toLowerCase()) &&
          emp.cc.toString().includes(filtroDocumento) &&
          emp.area.toLowerCase().includes(filtroArea.toLowerCase()) &&
          cumpleFecha
        );
      })
      .map(emp => recalcularValoresPorFecha(emp, fechaDesde, fechaHasta));
    setEmpleadosFiltrados(filtrados);
  };

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroDocumento("");
    setFiltroArea("");
    setFechaDesde("");
    setFechaHasta("");
    if (resumen) {
      setEmpleadosFiltrados(resumen.resumenEmpleados.map(emp => recalcularValoresPorFecha(emp)));
    }
  };

  return (
    <div className="resumen-nomina-container">
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
          <button onClick={filtrarEmpleados}>
            <FaSearch style={{ marginRight: 5 }} />
            Buscar
          </button>
          <button onClick={limpiarFiltros}>
            <FaEraser style={{ marginRight: 5 }} />
            Limpiar
          </button>

        </div>
      </fieldset>

      {empleadosFiltrados.length > 0 ? (
        <table border={1} cellPadding={4} className="resumen-nomina-table">
          <thead>
            <tr>
              <th rowSpan={2}>Trabajador</th>
              <th rowSpan={2}>N° Documento</th>
              <th rowSpan={2}>Área</th>
              <th colSpan={8}>Cantidades</th>
              <th colSpan={6}>Valores</th>
            </tr>
            <tr>
              <th>Turnos</th>
              <th>Horas trabajadas</th>
              <th>Horas extras diurnas</th>
              <th>Horas extras nocturnas</th>
              <th>Total horas extras</th>
              <th>Recargo nocturno</th>
              <th>Recargo festivo</th>
              <th>Horas festivas</th>
              <th>Valor horas extras</th>
              <th>Valor recargo nocturno</th>
              <th>Valor recargo festivo</th>
              <th>Neto a pagar</th>
              <th>Costo total</th>
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.map(emp => (
              <tr key={emp.id}>
                <td>{emp.nombre} {emp.apellido}</td>
                <td>{parseFloat(emp.cc).toLocaleString('es-CO')}</td>
                <td>{emp.area}</td>
                <td>{emp.cantidadTurnos}</td>
                <td>{emp.totalHoras}</td>
                <td>{emp.horas?.horasExtraDiurnas ?? "0.00"}</td>
                <td>{emp.horas?.horasExtraNocturnas ?? "0.00"}</td>
                <td>{emp.horas?.horasExtraTotales ?? "0.00"}</td>
                <td>{emp.horas?.recargoNocturno ?? "0.00"}</td>
                <td>{emp.horas?.horasFestivas ?? "0.00"}</td>
                <td>{emp.horas?.recargoFestivo ?? "0.00"}</td>
                <td>${emp.pagoExtra.toLocaleString('es-CO')}</td>
                <td>${emp.valores?.recargoNocturno?.toLocaleString('es-CO') ?? 0}</td>
                <td>${emp.pagoFestivo?.toLocaleString('es-CO') ?? 0}</td>
                <td><b>${emp.totalPagar.toLocaleString('es-CO')}</b></td>
                <td><b>${emp.costoTotal.toLocaleString('es-CO')}</b></td>
              </tr>
            ))}
          </tbody>
          {empleadosFiltrados.length > 0 && (
            <tfoot>
              <tr style={{ background: "#f8fafc", fontWeight: "bold" }}>
                <td colSpan={3}>Totales</td>
                <td>
                  {empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.cantidadTurnos), 0)}
                </td>
                <td>
                  {empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.totalHoras), 0).toFixed(2)}
                </td>
                <td>
                  {empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.horas?.horasExtraDiurnas || 0), 0).toFixed(2)}
                </td>
                <td>
                  {empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.horas?.horasExtraNocturnas || 0), 0).toFixed(2)}
                </td>
                <td>
                  {empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.horas?.horasExtraTotales || 0), 0).toFixed(2)}
                </td>
                <td>
                  {empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.horas?.recargoNocturno || 0), 0).toFixed(2)}
                </td>
                <td>
                  {empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.horas?.horasFestivas || 0), 0).toFixed(2)}
                </td>
                <td>
                  {empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.horas?.recargoFestivo || 0), 0).toFixed(2)}
                </td>
                <td>
                  ${empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.pagoExtra), 0).toLocaleString('es-CO')}
                </td>
                <td>
                  ${empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.valores?.recargoNocturno ?? 0), 0).toLocaleString('es-CO')}
                </td>
                <td>
                  ${empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.pagoFestivo ?? 0), 0).toLocaleString('es-CO')}
                </td>
                <td>
                  <b>${empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.totalPagar), 0).toLocaleString('es-CO')}</b>
                </td>
                <td>
                  <b>${empleadosFiltrados.reduce((sum, emp) => sum + Number(emp.costoTotal), 0).toLocaleString('es-CO')}</b>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      ) : (
        <div className="no-empleados">
          <p>No hay resúmenes de nómina disponibles con los filtros actuales.</p>
          <span>Modifica los filtros o agrega empleados y turnos para visualizar el resumen de nómina aquí.</span>
        </div>
      )}
    </div>
  );
}

export default ResumenNomina;