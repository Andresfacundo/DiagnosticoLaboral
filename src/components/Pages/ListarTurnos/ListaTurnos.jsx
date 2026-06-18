import React, { useEffect, useState } from "react";
import { turnosFetch } from "../../../Services/useFetchTurnos";
import EditarTurnoModal from "../../Ui/EditarTurnoModal/EditarTurnoModal";
import "./ListadoTurnos.css";
import editar from "../../../assets/editar.svg"
import eliminar from "../../../assets/delete.png"
import Filtros from "../../Ui/Filtros/Filtros";

const ListadoTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [turnoEditar, setTurnoEditar] = useState(null);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState({
    nombre: "",
    apellido: "",
    area: "",
    cc: "",
    diaInicio: "",
    diaFin: ""
  });


  const campos = [
    { nombre: "nombre", tipo: "text", placeholder: "Nombre" },
    { nombre: "apellido", tipo: "text", placeholder: "Apellido" },
    { nombre: "area", tipo: "text", placeholder: "Área" },
    { nombre: "cc", tipo: "text", placeholder: "Documento" },
    { nombre: "diaInicio", tipo: "date", placeholder: "Día inicio" },
    { nombre: "diaFin", tipo: "date", placeholder: "Día fin" },
  ];

  const cargarTurnos = async (filtrosOpcionales = {}) => {
    try {
      const data = await turnosFetch.listar(filtrosOpcionales);
      setTurnos(Array.isArray(data) ? data : data.turnos || []);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar turnos");
    }
  };

  const eliminarTurno = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este turno?")) return;
    await turnosFetch.eliminar(id);
    cargarTurnos();
  };

  const guardarCambios = async (id, form) => {
    try {
      await turnosFetch.actualizar(id, form);
      alert("Turno actualizado correctamente");
      setTurnoEditar(null);
      cargarTurnos();
    } catch (err) {
      alert(err.response?.data?.error || "Error al actualizar turno");
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  return (
    <section className="listado-turnos">
      <div className="container-filtros-turnos">
        <button className="btn-imprimir-turnos" onClick={() => window.print()}>Generar PDF</button>

        <Filtros
          titulo="Filtros"
          campos={campos}
          filtros={filtros}
          setFiltros={setFiltros}
          onAplicar={(f) => cargarTurnos(f)}
          onLimpiar={() => {
            const vacios = {
              nombre: "",
              apellido: "",
              area: "",
              cc: "",
              diaInicio: "",
              diaFin: "",
            };
            setFiltros(vacios)
            cargarTurnos({})
          }}
        />
      </div>

      {error && <p className="mensaje-error">{error}</p>}

      <div className="tabla-container-turnos">
        <table className="tabla-turnos">
          <thead>
            <tr>
              <th>Trabajador</th>
              <th>CC</th>
              <th>Área</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Hora inicio</th>
              <th>Hora fin</th>
              <th>Descanso (min)</th>
              <th>Inicio descanso</th>
              <th>Horas trabajadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length > 0 ? (
              turnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{turno.Trabajador.nombre} {turno.Trabajador.apellido}</td>
                  <td>{turno.Trabajador.cc}</td>
                  <td>{turno.Trabajador.area}</td>
                  <td>{turno.diaInicio}</td>
                  <td>{turno.diaFin}</td>
                  <td>{turno.horaInicio}</td>
                  <td>{turno.horaFin}</td>
                  <td>{turno.minutosDescanso}</td>
                  <td>{turno.inicioDescanso || 0}</td>
                  <td>{turno.tiempoTrabajado}</td>
                  <td className="acciones-turnos">
                    <button
                      className="btn-editar-turnos"
                      onClick={() => setTurnoEditar(turno)}
                    >
                      <img src={editar} alt="" />
                      {/* Editar */}
                    </button>
                    <button
                      className="btn-eliminar-turnos"
                      onClick={() => eliminarTurno(turno.id)}
                    >
                      <img src={eliminar} alt="" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="18" className="no-turnos">
                  <p>No hay turnos registrados</p>
                  <span>Modifica los filtros o agrega trabajadores para visualizar turnos</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {turnoEditar && (
        <EditarTurnoModal
          turno={turnoEditar}
          onClose={() => setTurnoEditar(null)}
          onSave={guardarCambios}
        />
      )}
    </section>
  );
};

export default ListadoTurnos;
