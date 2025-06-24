import React, { useEffect, useState } from "react";
import './ListaEmpleados.css';
import deleteIcon from '../../../assets/delete.png'; // Asegúrate de tener un ícono de eliminar

function ListaEmpleados() {
  const [empleados, setEmpleados] = useState([]);

  const cargarEmpleados = () => {
    const empleadosGuardados = localStorage.getItem("empleados");
    if (empleadosGuardados) {
      setEmpleados(JSON.parse(empleadosGuardados));
    } else {
      setEmpleados([]);
    }
  };

  useEffect(() => {
    cargarEmpleados();
    window.addEventListener("localStorageUpdated", cargarEmpleados);
    return () => {
      window.removeEventListener("localStorageUpdated", cargarEmpleados);
    };
  }, []);

  // const handleDelete = (index) => {
  //   const actualizados = empleados.filter((_, i) => i !== index);
  //   setEmpleados(actualizados);
  //   localStorage.setItem("empleados", JSON.stringify(actualizados));
  //   window.dispatchEvent(new Event("localStorageUpdated"));
  // };

  const handleDelete = (index) => {
    const empleadosGuardados = JSON.parse(localStorage.getItem("empleados")) || [];
    const empleadoEliminado = empleadosGuardados[index];

    // Elimina el empleado de la lista
    const actualizados = empleados.filter((_, i) => i !== index);
    setEmpleados(actualizados);
    localStorage.setItem("empleados", JSON.stringify(actualizados));

    // Elimina los turnos asociados a ese empleado
    const turnosGuardados = JSON.parse(localStorage.getItem("turnos")) || [];
    const turnosActualizados = turnosGuardados.filter(
      (turno) => String(turno.empleadoId) !== String(empleadoEliminado.id)
    );
    localStorage.setItem("turnos", JSON.stringify(turnosActualizados));

    // Notifica a otros componentes
    window.dispatchEvent(new Event("localStorageUpdated"));
  };

  return (
    <div className="lista-empleados-container">
      {empleados.length > 0 ? (
        <table className="empleados-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cédula</th>
              <th>Clasificación</th>
              <th>Área</th>
              <th>Salario Base</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp, index) => (
              <tr key={index}>
                <td data-label="Nombre">{emp.nombre}</td>
                <td data-label="Apellido">{emp.apellido}</td>
                <td data-label="Cédula">{emp.cc}</td>
                <td data-label="Clasificación">{emp.clasificacionPersonal}</td>
                <td data-label="Área">{emp.area}</td>
                <td data-label="Salario Base">${parseFloat(emp.salarioBase).toLocaleString('es-CO')}</td>
                <td data-label="Acciones">
                  <button onClick={() => handleDelete(index)} className="delete-button"><img src={deleteIcon} alt="" /></button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      ) : (
        <div className="no-empleados">
          <p>No hay empleados registrados aún.</p>
          <span>Utiliza el formulario para agregar nuevos empleados.</span>
        </div>
      )}
    </div>
  );
}

export default ListaEmpleados;
