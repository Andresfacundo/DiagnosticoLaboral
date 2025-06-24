import React, { useEffect, useState } from "react";
import './ResumenNomina.css';
const API_URL = import.meta.env.VITE_API_URL;

function ResumenNomina({ actualizar }) {
  const [resumen, setResumen] = useState(null);


  useEffect(() => {
    const empleadosGuardados = localStorage.getItem("empleados");
    const turnosGuardados = localStorage.getItem("turnos");

    fetch(`${API_URL}/api/resumen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empleados: JSON.parse(empleadosGuardados || "[]"),
        turnos: JSON.parse(turnosGuardados || "[]")
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener resumen");
        return res.json();
      })
      .then(data => {
        setResumen(data);
      })
      .catch(error => {
        console.error("Error al cargar resumen:", error);
      });
  }, [actualizar]);
  console.log('resumen', resumen);


  if (!resumen) return <p>Cargando resumen...</p>;

  return (
    <div>
      {resumen.resumenEmpleados.length > 0 ? (
        <table border={1} cellPadding={4} className="resumen-nomina-table">
          <thead>
            <tr>
              <th rowSpan={2}>Trabajadores</th>
              <th rowSpan={2}>N° Documento</th>
              <th rowSpan={2}>Área</th>
              <th colSpan={4}>Cantidades</th>
              <th colSpan={5}>Valores</th>
            </tr>
            <tr>
              <th>Turnos</th>
              <th>Horas trabajadas</th>
              <th>Horas extra</th>
              <th>Horas recargo nocturno</th>
              <th>Salario base</th>
              <th>Pago extra</th>
              <th>Valor recargo nocturno</th>
              <th>Total a pagar</th>
            </tr>
          </thead>
          <tbody>
            {resumen.resumenEmpleados.map(emp => (
              <tr key={emp.id}>
                <td data-label="Empleado">{emp.nombre} {emp.apellido}</td>
                <td data-label="N° Documento">{emp.cc}</td>
                <td data-label="Área">{emp.area}</td>
                <td data-label="Turnos">{emp.cantidadTurnos}</td>
                {/* Cantidades */}
                <td data-label="Horas trabajadas">{emp.totalHoras}</td>
                <td data-label="Horas extra">{emp.horasExtra}</td>
                <td data-label="Horas recargo nocturno">
                  {emp.horas && emp.horas.recargoNocturno
                    ? Number(emp.horas.recargoNocturno).toLocaleString('es-CO')
                    : 0}
                </td>
                {/* Valores */}
                <td data-label="Salario base">${emp.salarioBase.toLocaleString('es-CO')}</td>
                <td data-label="Pago extra">${emp.pagoExtra.toLocaleString('es-CO')}</td>
                <td data-label="Valor recargo nocturno">
                  ${emp.valores && emp.valores.recargoNocturno
                    ? Number(emp.valores.recargoNocturno).toLocaleString('es-CO')
                    : 0}
                </td>
                <td data-label="Total a pagar"><b>${emp.totalPagar.toLocaleString('es-CO')}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-empleados">
          <p>No hay resúmenes de nómina disponibles aún.</p>
          <span>Agrega empleados y turnos para visualizar el resumen de nómina aquí.</span>
        </div>
      )}
    </div>
  );
}

export default ResumenNomina;