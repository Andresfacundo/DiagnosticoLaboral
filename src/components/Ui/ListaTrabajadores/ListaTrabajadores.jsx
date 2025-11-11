// // src/components/Trabajadores/TrabajadorList.jsx
// import React, { useState } from "react";
// import './ListaTrabajadores.css'

// export default function TrabajadorList({ trabajadores, onEdit, onDelete }) {
//   const [editId, setEditId] = useState(null);
//   const [form, setForm] = useState({});
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [empleadoEdit, setEmpleadoEdit] = useState(null);

//   const startEdit = (t) => {
//     setEditId(t.id);
//     setForm(t);
//   };

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSave = () => {
//     onEdit(editId, form);
//     setEditId(null);
//   };

//   return (
//     <>

//       <table className="tabla-trabajadores">
//         <thead>
//           <tr>
//             <th>Nombre</th>
//             <th>Apellido</th>
//             <th>Cédula</th>
//             <th>Clasificación</th>
//             <th>Área</th>
//             <th>Salario Base</th>
//             <th>Color</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {trabajadores.map((t) => (
//             <tr key={t.id}>
//               {editId === t.id ? (
//                 <>
//                   <td><input name="nombre" value={form.nombre} onChange={handleChange} /></td>
//                   <td><input name="apellido" value={form.apellido} onChange={handleChange} /></td>
//                   <td><input name="cc" value={form.cc} onChange={handleChange} /></td>
//                   <td><input name="Clasificacion del personal" value={form.clasificacionPersonal} onChange={handleChange} /></td>
//                   <td><input name="area" value={form.area} onChange={handleChange} /></td>
//                   <td><input name="salarioBase" value={form.salarioBase} onChange={handleChange} /></td>
//                   <td>
//                     <button onClick={handleSave}>Guardar</button>
//                     <button onClick={() => setEditId(null)}>Cancelar</button>
//                   </td>
//                 </>
//               ) : (
//                 <>
//                   <td>{t.nombre}</td>
//                   <td>{t.apellido}</td>
//                   <td>{t.cc}</td>
//                   <td>{t.clasificacionPersonal}</td>
//                   <td>{t.area}</td>
//                   <td>{t.salarioBase}</td>
//                   <td>
//                     <div
//                       style={{
//                         backgroundColor: t.color || "#333",
//                         width: "20px",
//                         height: "20px",
//                         borderRadius: "50%",
//                       }}
//                     >
//                     </div>
//                   </td>

//                   <td>
//                     <button onClick={() => startEdit(t)}>Editar</button>
//                     <button onClick={() => onDelete(t.id)}>Eliminar</button>
//                   </td>
//                 </>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {showEditModal && empleadoEdit && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>Editar trabajador</h3>
//             <form className="edit-form-emp">
//               <input type="text" name="nombre" value={empleadoEdit.nombre} onChange={handleEditChange} />
//               <input type="text" name="apellido" value={empleadoEdit.apellido} onChange={handleEditChange} />
//               <input type="text" name="cc" value={empleadoEdit.cc} onChange={handleEditChange} />
//               <select
//                 name="clasificacionPersonal"
//                 value={empleadoEdit.clasificacionPersonal}
//                 onChange={handleEditChange}
//               >
//                 <option value="" disabled>
//                   Clasificación del personal
//                 </option>
//                 <option value="Ordinario">Ordinario</option>
//                 <option value="Direccion, confianza o manejo">Dirección, confianza o manejo</option>
//               </select>
//               <input type="text" name="area" value={empleadoEdit.area} onChange={handleEditChange} />
//               <input type="number" name="salarioBase" value={empleadoEdit.salarioBase} onChange={handleEditChange} />
//               <label className="color-label">
//                 Color del trabajador
//                 <div className="color-input-wrapper">
//                   <input type="color" name="color" value={empleadoEdit.color} onChange={handleEditChange} />
//                 </div>
//               </label>
//             </form>
//             <div className="modal-actions">
//               <button onClick={handleEditSave} className="save-button">
//                 Guardar
//               </button>
//               <button onClick={() => setShowEditModal(false)} className="cancel-button">
//                 Cancelar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
import React, { useState } from "react";
import "../../Pages/ListaEmpleados/ListaEmpleados.css";
import deleteIcon from "../../../assets/delete.png";
import editar from "../../../assets/editar.svg";

function ListaTrabajadores({ trabajadores, onEdit, onDelete }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empleadoEdit, setEmpleadoEdit] = useState(null);
  const [empleadoDelete, setEmpleadoDelete] = useState(null);

  // Abrir modal de edición
  const handleEditClick = (emp) => {
    setEmpleadoEdit(emp);
    setShowEditModal(true);
  };

  // Guardar cambios
  const handleEditSave = () => {
    if (empleadoEdit) {
      onEdit(empleadoEdit.id, empleadoEdit);
      setShowEditModal(false);
    }
  };

  // Detectar cambios en inputs
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEmpleadoEdit((prev) => ({ ...prev, [name]: value }));
  };

  // Eliminar
  const handleDeleteClick = (emp) => {
    setEmpleadoDelete(emp);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (empleadoDelete) {
      onDelete(empleadoDelete.id);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="lista-empleados-container">
      {trabajadores.length > 0 ? (
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
            {trabajadores.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.nombre}</td>
                <td>{emp.apellido}</td>
                <td>{emp.cc}</td>
                <td>{emp.clasificacionPersonal}</td>
                <td>{emp.area}</td>
                <td>${emp.salarioBase}</td>
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
              <input
                type="text"
                name="nombre"
                value={empleadoEdit.nombre}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="apellido"
                value={empleadoEdit.apellido}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="cc"
                value={empleadoEdit.cc}
                onChange={handleEditChange}
              />
              <select
                name="clasificacionPersonal"
                value={empleadoEdit.clasificacionPersonal}
                onChange={handleEditChange}
              >
                <option value="" disabled>
                  Clasificación del personal
                </option>
                <option value="Ordinario">Ordinario</option>
                <option value="Direccion, confianza o manejo">
                  Dirección, confianza o manejo
                </option>
              </select>
              <input
                type="text"
                name="area"
                value={empleadoEdit.area}
                onChange={handleEditChange}
              />
              <input
                type="number"
                name="salarioBase"
                value={empleadoEdit.salarioBase}
                onChange={handleEditChange}
              />
              <label className="color-label">
                Color del trabajador
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    name="color"
                    value={empleadoEdit.color}
                    onChange={handleEditChange}
                  />
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
      {showDeleteModal && (
        <div className="modal-confirmacion">
          <div className="modal-content-confirmacion">
            <p>¿Estás seguro que deseas borrar este trabajador?</p>
            <div className="modal-actions">
              <button onClick={handleDeleteConfirm} className="save-button">
                Sí, borrar
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaTrabajadores;
