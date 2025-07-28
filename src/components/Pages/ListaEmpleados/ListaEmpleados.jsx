import React, { useEffect, useState } from "react";
import './ListaEmpleados.css';
import deleteIcon from '../../../assets/delete.png';
import editar from '../../../assets/editar.svg'

function ListaEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [empleadoEdit, setEmpleadoEdit] = useState(null);

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
  const handleEditClick = (empleado) => {
    setEmpleadoEdit({ ...empleado });
    setShowEditModal(true);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "cc" || name === "salarioBase") {
      const numericValue = value.replace(/[^0-9]/g, '');
      setEmpleadoEdit((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setEmpleadoEdit((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSave = () => {
    const actualizados = empleados.map(emp =>
      emp.id === empleadoEdit.id ? empleadoEdit : emp
    );
    setEmpleados(actualizados);
    localStorage.setItem("empleados", JSON.stringify(actualizados));
    window.dispatchEvent(new Event("localStorageUpdated"));
    setShowEditModal(false);
    setEmpleadoEdit(null);
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
              <th>Color</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp, index) => (
              <tr key={index}>
                <td data-label="Nombre">{emp.nombre}</td>
                <td data-label="Apellido">{emp.apellido}</td>
                <td data-label="Cédula">{parseFloat(emp.cc).toLocaleString('es-CO')}</td>
                <td data-label="Clasificación">{emp.clasificacionPersonal}</td>
                <td data-label="Área">{emp.area}</td>
                <td data-label="Salario Base">${parseFloat(emp.salarioBase).toLocaleString('es-CO')}</td>
                <td data-label="Color">
                  <div style={{
                    backgroundColor: emp.color || '#ccc',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                  }} />
                </td>

                <td data-label="Acciones" className="acciones">
                  <button onClick={() => handleEditClick(emp)} className="edit-button">
                    <img className='editar-btn' src={editar} alt="" />
                  </button>
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
      {showEditModal && empleadoEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Empleado</h3>
            <form className="edit-form-emp">
              <input
                type="text"
                name="nombre"
                value={empleadoEdit.nombre}
                onChange={handleEditChange}
                placeholder="Nombre"
              />
              <input
                type="text"
                name="apellido"
                value={empleadoEdit.apellido}
                onChange={handleEditChange}
                placeholder="Apellido"
              />
              <input
                type="text"
                name="cc"
                value={parseFloat(empleadoEdit.cc).toLocaleString('es-CO')}
                onChange={handleEditChange}
                placeholder="Cédula"
              />
              <select name="clasificacionPersonal" value={empleadoEdit.clasificacionPersonal} onChange={handleEditChange}>
                <option value="" disabled>Clasificación del personal</option>
                <option value="Ordinario">Ordinario</option>
                <option value="Direccion, confianza o manejo">Dirección, confianza o manejo</option>
              </select>
              <input
                type="text"
                name="area"
                value={empleadoEdit.area}
                onChange={handleEditChange}
                placeholder="Área"
              />
              <input
                type="text"
                name="salarioBase"
                value={'$' + parseFloat(empleadoEdit.salarioBase).toLocaleString('es-CO')}
                onChange={handleEditChange}
                placeholder="Salario Base"
                onWheel={e => e.target.blur()}
              />
              <input
                type="color"
                name="color"
                value={empleadoEdit.color || '#000000'}
                onChange={handleEditChange}
              />
            </form>
            <div className="modal-actions">
              <button onClick={handleEditSave} className="save-button">Guardar</button>
              <button onClick={() => setShowEditModal(false)} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}
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