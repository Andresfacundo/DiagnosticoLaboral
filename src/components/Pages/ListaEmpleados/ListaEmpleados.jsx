import React, { useEffect, useState } from "react";
import "./ListaEmpleados.css";
import deleteIcon from "../../../assets/delete.png";
import editar from "../../../assets/editar.svg";
import { toast } from "react-toastify";
import axios, { all } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function ListaEmpleados({actualizar}) {
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteEmpleado, setDeleteEmpleado] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [empleadoEdit, setEmpleadoEdit] = useState(null);

  const cargarEmpleados = async () => {
    try {
      const storedSessionId = localStorage.getItem("sessionid");
      const trabajadores = JSON.parse(localStorage.getItem("empleados"))

      const trabajadoresLocales = trabajadores.map((t) => ({
        ...t,
        local: true,
      }));

      const response = await axios.get(`${API_URL}/api/empleados`, {
        headers: { sessionId: storedSessionId },
      });
      const allTrabajadores = [...response.data, ...trabajadoresLocales]
      setEmpleados(allTrabajadores);
    } catch (err) {
      toast.error(`Error cargando trabajadores: ${err.response?.data?.error || err.message}`);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, [actualizar]);

  const handleDeleteClick = (empleado) => {
    setDeleteEmpleado(empleado);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteEmpleado.local) {
        // viene de localStorage
        const trabajadores = JSON.parse(localStorage.getItem("empleados")) || [];
        const nuevos = trabajadores.filter((t) => t.id !== deleteEmpleado.id);
        localStorage.setItem("empleados", JSON.stringify(nuevos));
        toast.success("Trabajador eliminado con éxito");
        setEmpleados((prev) => prev.filter((t) => t.id !== deleteEmpleado.id));
      } else {
        //  viene de la BD
        const storedSessionId = localStorage.getItem("sessionid");
        await axios.delete(`${API_URL}/api/empleados/${deleteEmpleado.id}`, {
          headers: { sessionId: storedSessionId },
        });
        toast.success("Trabajador eliminado con éxito");
        cargarEmpleados();
      }
      setShowModal(false);
      setDeleteEmpleado(null);
    } catch (err) {
      toast.error(
        `Error eliminando trabajador: ${err.response?.data?.error || err.message}`
      );
    }
  };


  const handleDeleteCancel = () => {
    setShowModal(false);
    setDeleteEmpleado(null);
  };

  const handleEditClick = (empleado) => {
    setEmpleadoEdit({ ...empleado });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEmpleadoEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditSave = async () => {
    try {
      if (empleadoEdit.local) {
        // editar en localStorage
        const trabajadores = JSON.parse(localStorage.getItem("empleados")) || [];
        const nuevos = trabajadores.map((t) =>
          t.id === empleadoEdit.id ? empleadoEdit : t
        );
        localStorage.setItem("empleados", JSON.stringify(nuevos));
        toast.success("Trabajador actualizado con éxito");
        setEmpleados((prev) =>
          prev.map((t) => (t.id === empleadoEdit.id ? empleadoEdit : t))
        );
      } else {
        //  editar en la BD
        const storedSessionId = localStorage.getItem("sessionid");
        await axios.patch(
          `${API_URL}/api/empleados/${empleadoEdit.id}`,
          empleadoEdit,
          { headers: { sessionId: storedSessionId } }
        );
        toast.success("Trabajador actualizado con éxito");
        cargarEmpleados();
      }

      setShowEditModal(false);
      setEmpleadoEdit(null);
    } catch (err) {
      toast.error(
        `Error actualizando trabajador: ${err.response?.data?.error || err.message}`
      );
    }
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
            {empleados.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.nombre}</td>
                <td>{emp.apellido}</td>
                <td>{parseFloat(emp.cc).toLocaleString("es-CO")}</td>
                <td>{emp.clasificacionPersonal}</td>
                <td>{emp.area}</td>
                <td>${parseFloat(emp.salarioBase).toLocaleString("es-CO")}</td>
                <td>
                  <div
                    style={{
                      backgroundColor: emp.color || "#ccc",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td className="acciones">
                  <button onClick={() => handleEditClick(emp)} className="edit-button">
                    <img className="editar-btn" src={editar} alt="Editar" />
                  </button>
                  <button onClick={() => handleDeleteClick(emp)} className="delete-button">
                    <img src={deleteIcon} alt="Eliminar" />
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

      {/* Modal de edición */}
      {showEditModal && empleadoEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar trabajador</h3>
            <form className="edit-form-emp">
              <input type="text" name="nombre" value={empleadoEdit.nombre} onChange={handleEditChange} />
              <input type="text" name="apellido" value={empleadoEdit.apellido} onChange={handleEditChange} />
              <input type="text" name="cc" value={empleadoEdit.cc} onChange={handleEditChange} />
              <select
                name="clasificacionPersonal"
                value={empleadoEdit.clasificacionPersonal}
                onChange={handleEditChange}
              >
                <option value="" disabled>
                  Clasificación del personal
                </option>
                <option value="Ordinario">Ordinario</option>
                <option value="Direccion, confianza o manejo">Dirección, confianza o manejo</option>
              </select>
              <input type="text" name="area" value={empleadoEdit.area} onChange={handleEditChange} />
              <input type="number" name="salarioBase" value={empleadoEdit.salarioBase} onChange={handleEditChange} />
              <label className="color-label">
                Color del trabajador
                <div className="color-input-wrapper">
                  <input type="color" name="color" value={empleadoEdit.color} onChange={handleEditChange} />
                </div>
              </label>
            </form>
            <div className="modal-actions">
              <button onClick={handleEditSave} className="save-button">
                Guardar
              </button>
              <button onClick={() => setShowEditModal(false)} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showModal && (
        <div className="modal-confirmacion">
          <div className="modal-content-confirmacion">
            <p>¿Estás seguro que deseas borrar este trabajador?</p>
            <div className="modal-actions">
              <button onClick={handleDeleteConfirm} className="save-button">
                Sí, borrar
              </button>
              <button onClick={handleDeleteCancel} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaEmpleados;
