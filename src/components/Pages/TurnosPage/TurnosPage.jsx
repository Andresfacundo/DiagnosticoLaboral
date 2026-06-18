// import React, { useEffect, useState } from "react";
// import { turnosFetch } from "../../../Services/useFetchTurnos";
// import { toast } from "react-toastify";
// import TurnoForm from "../../Ui/TurnosForm/TurnosForm";
// import TurnoList from "../../Ui/TurnosList/TurnosList";
// import "./TurnosPage.css";

// export default function TurnosPage({ trabajadorId }) {
//   const [turnos, setTurnos] = useState([]);
//   const [editTurno, setEditTurno] = useState(null);

//   const cargarTurnos = async () => {
//     try {
//       const data = await turnosFetch.listar();
//       setTurnos(data);
//     } catch (err) {
//       toast.error(`Error al cargar turnos: ${err.message}`);
//     }
//   };

//   useEffect(() => {
//     cargarTurnos();
//   }, []);

//   const handleAdd = async (trabajadorId, data) => {
//     try {
//       if (editTurno) {
//         await turnosFetch.editar(editTurno.id, data);
//         toast.success("Turno actualizado con éxito");
//         setEditTurno(null);
//       } else {
//         await turnosFetch.crear(trabajadorId, data);
//         toast.success("Turno creado con éxito");
//       }
//       cargarTurnos();
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Error al guardar turno");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await turnosFetch.eliminar(id);
//       toast.success("Turno eliminado con éxito");
//       cargarTurnos();
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Error al eliminar turno");
//     }
//   };

//   return (
//     <div className="turnos-page">
//       <h2>Gestión de Turnos</h2>
//       {/* <TurnoForm
//         onSubmit={handleAdd}
//         initialData={editTurno}
//         trabajadorId={trabajadorId}
//       /> */}
//       {/* <TurnoList
//         turnos={turnos}
//         onEdit={setEditTurno}
//         onDelete={handleDelete}
//       /> */}
//     </div>
//   );
// }
