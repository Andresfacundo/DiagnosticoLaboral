import React, { useEffect, useState } from "react";
import './ListaEmpleados.css';
import deleteIcon from '../../../assets/delete.png';

function ListaEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

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

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    const empleadosGuardados = JSON.parse(localStorage.getItem("empleados")) || [];
    const empleadoEliminado = empleadosGuardados[deleteIndex];

    const actualizados = empleados.filter((_, i) => i !== deleteIndex);
    setEmpleados(actualizados);
    localStorage.setItem("empleados", JSON.stringify(actualizados));

    const turnosGuardados = JSON.parse(localStorage.getItem("turnos")) || [];
    const turnosActualizados = turnosGuardados.filter(
      (turno) => String(turno.empleadoId) !== String(empleadoEliminado.id)
    );
    localStorage.setItem("turnos", JSON.stringify(turnosActualizados));

    window.dispatchEvent(new Event("localStorageUpdated"));
    setShowModal(false);
    setDeleteIndex(null);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
    setDeleteIndex(null);
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
                  <button onClick={() => handleDeleteClick(index)} className="delete-button">
                    <img src={deleteIcon} alt="" />
                  </button>
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

      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro que deseas borrar este trabajador?</p>
            <div className="modal-actions">
              <button onClick={handleDeleteConfirm} className="save-button">Sí, borrar</button>
              <button onClick={handleDeleteCancel} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaEmpleados;