import React, { useEffect, useState } from "react";
import { FaSearch, FaEraser } from "react-icons/fa";
import './ResumenNomina.css';
import SpinnerTimed from "../../Ui/SpinnerTimed/SpinnerTimed";

const API_URL = import.meta.env.VITE_API_URL;

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

  const totalHoras = turnosFiltrados.reduce((sum, turno) => sum + parseFloat(turno.tiempoTrabajado || 0), 0);
  const horasExtra = turnosFiltrados.reduce((sum, turno) => sum + parseFloat(turno.horasExtra || 0), 0);
  const totalHorasNocturnas = turnosFiltrados.reduce((sum, turno) => sum + parseFloat(turno.horasNocturnas || 0), 0);
  const totalHorasFestivas = turnosFiltrados.reduce((sum, turno) => sum + parseFloat(turno.horasFestivas || 0), 0);

  const valores = {
    horasExtra: empleado.esTrabajadorDireccion ? 0 : horasExtra * salarioHora * 1.25,
    recargoNocturno: totalHorasNocturnas * salarioHora * 0.35,
    recargoFestivo: totalHorasFestivas * salarioHora * 0.80
  };

  const totalValores = Object.values(valores).reduce((sum, val) => sum + val, 0);
  const totalPagar = Math.round(totalValores * 0.92);
  const costoTotal = Math.round(totalValores * 1.3855);
  const pagoExtra = Math.round(valores.horasExtra);
  const valorRecargoNocturno = Math.round(valores.recargoNocturno);
  const pagoFestivo = Math.round(valores.recargoFestivo);

  return {
    ...empleado,
    cantidadTurnos,
    totalHoras: totalHoras.toFixed(2),
    horasExtra: horasExtra.toFixed(2),
    pagoExtra,
    pagoFestivo,
    totalPagar,
    costoTotal,
    horas: {
      ...empleado.horas,
      horasExtra: horasExtra.toFixed(2),
      recargoNocturno: totalHorasNocturnas.toFixed(2),
      horasFestivas: totalHorasFestivas.toFixed(2),
      totalHoras: totalHoras.toFixed(2)
    },
    valores: {
      ...empleado.valores,
      horasExtra: pagoExtra,
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
      </fieldset>

      {empleadosFiltrados.length > 0 ? (
        <table border={1} cellPadding={4} className="resumen-nomina-table">
          <thead>
            <tr>
              <th rowSpan={2}>Trabajador</th>
              <th rowSpan={2}>N° Documento</th>
              <th rowSpan={2}>Área</th>
              <th colSpan={5}>Cantidades</th>
              <th colSpan={6}>Valores</th>
            </tr>
            <tr>
              <th>Turnos</th>
              <th>Horas trabajadas</th>
              <th>Horas extra</th>
              <th>Horas recargo nocturno</th>
              <th>Horas recargo festivo</th>
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
                <td>{emp.horasExtra}</td>
                <td>{emp.horas?.recargoNocturno ?? 0}</td>
                <td>{emp.horas?.horasFestivas ?? 0}</td>
                <td>${emp.pagoExtra.toLocaleString('es-CO')}</td>
                <td>${emp.valores?.recargoNocturno?.toLocaleString('es-CO') ?? 0}</td>
                <td>${emp.pagoFestivo?.toLocaleString('es-CO') ?? 0}</td>
                <td><b>${emp.totalPagar.toLocaleString('es-CO')}</b></td>
                <td><b>${emp.costoTotal.toLocaleString('es-CO')}</b></td>
              </tr>
            ))}
          </tbody>
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
