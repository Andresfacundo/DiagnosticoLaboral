import React, { useEffect, useState } from "react";
import './ResumenNomina.css';

function ResumenNomina({ actualizar }) {
  const [resumen, setResumen] = useState(null);

  // useEffect(() => {
  //   const empleadosGuardados = localStorage.getItem("empleados");
  //   const turnosGuardados = localStorage.getItem("turnos");

  //   fetch("http://localhost:3000/api/resumen")
  //     .then(res => {
  //       if (!res.ok) throw new Error("Error al obtener resumen");
  //       return res.json();
  //     })
  //     .then(data => {
  //       setResumen(data);
  //     })
  //     .catch(error => {
  //       console.error("Error al cargar resumen:", error);
  //     });
  // }, [actualizar]);

  useEffect(() => {
    const empleadosGuardados = localStorage.getItem("empleados");
    const turnosGuardados = localStorage.getItem("turnos");

    fetch("http://localhost:3000/api/resumen", {
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


  if (!resumen) return <p>Cargando resumen...</p>;

  return (
    <div>
      <table border={1} cellPadding={4} className="resumen-nomina-table">
        <thead>
          <tr>
            <th>Empleado</th>
            <th>N° Documento</th>
            <th>Área</th>
            <th>Salario base</th>
            {/* <th>Salario hora</th> */}
            <th>Horas trabajadas</th>
            {/* <th>Horas regulares</th> */}
            <th>Horas extra</th>
            <th>Pago regular</th>
            <th>Pago extra</th>
            <th>Total a pagar</th>
            <th>Turnos</th>
          </tr>
        </thead>
        <tbody>
          {resumen.resumenEmpleados.map(emp => (
            <tr key={emp.id}>
              <td data-label="Empleado">{emp.nombre} {emp.apellido}</td>
              <td data-label="N° Documento">{emp.cc}</td>
              <td data-label="Área">{emp.area}</td>
              <td data-label="Salario base">${emp.salarioBase}</td>
              <td data-label="Horas trabajadas">{emp.totalHoras}</td>
              <td data-label="Horas extra">{emp.horasExtra}</td>
              <td data-label="Pago regular">${emp.pagoRegular}</td>
              <td data-label="Pago extra">${emp.pagoExtra}</td>
              <td data-label="Total a pagar"><b>${emp.totalPagar}</b></td>
              <td data-label="Turnos">{emp.cantidadTurnos}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <h3>Totales</h3>
      <ul className="resumen-nomina-totales">
        <li><b>Total horas trabajadas:</b> {resumen.totales.totalHoras}</li>
        <li><b>Total horas extra:</b> {resumen.totales.totalExtras}</li>
        <li><b>Total turnos:</b> {resumen.totales.totalTurnos}</li>
        <li><b>Total nómina:</b> ${resumen.totales.totalNomina}</li>
      </ul> */}
    </div>
  );
}

export default ResumenNomina;