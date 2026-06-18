import React, { useEffect, useState } from "react";
import "./RegistroHorasExtras.css";
import { registroExtrasFetch } from "../../../Services/UseFetchRegistroExtras";
import { trabajadorService } from "../../../Services/api";
import Filtros from "../../Ui/Filtros/Filtros";

function RegistroHorasExtras() {
  const [registrosExtras, setRegistrosExtras] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    apellido: "",
    area: "",
    cc: "",
    diaInicio: "",
    diaFin: ""
  })


  const campos = [
    { nombre: "nombre", tipo: "text", placeholder: "Nombre" },
    { nombre: "apellido", tipo: "text", placeholder: "Apellido" },
    { nombre: "area", tipo: "text", placeholder: "Área" },
    { nombre: "cc", tipo: "text", placeholder: "Documento" },
    { nombre: "diaInicio", tipo: "date", placeholder: "Día inicio" },
    { nombre: "diaFin", tipo: "date", placeholder: "Día fin" },
  ];

  // Cargar trabajadores (para futuro uso o validación)
  const cargarTrabajadores = async () => {
    try {
      const data = await trabajadorService.listar();
      setTrabajadores(data);
    } catch (error) {
      console.error("Error cargando trabajadores:", error);
    }
  };

  // Cargar registros (todos los trabajadores por defecto)
  const cargarRegistros = async (filtrosOpcionales = {}) => {
    try {
      const data = await registroExtrasFetch.listar(filtrosOpcionales);
      setRegistrosExtras(data);
    } catch (error) {
      console.error("Error cargando registros:", error);
    }
  };

  // Al montar el componente, carga todo
  useEffect(() => {
    cargarTrabajadores();
    cargarRegistros();
  }, []);

  return (
    <div className="registro-horas-extras-container">
      <div className="btn-imprimir-registros">
        <button onClick={() => window.print()}>Generar PDF</button>
        <Filtros
          titulo="Filtros"
          campos={campos}
          filtros={filtros}
          setFiltros={setFiltros}
          onAplicar={(f) => cargarRegistros(f)}
          onLimpiar={() => {
            const vacios = {
              nombre: "",
              apellido: "",
              area: "",
              cc: "",
              diaInicio: "",
              diaFin: ""
            };
            setFiltros(vacios)
            cargarRegistros({})
          }}
        />
      </div>
      <table border={1} cellPadding={4} className="registro-horas-extras-table">
        <thead>
          <tr>
            <th>Trabajador</th>
            <th>CC</th>
            <th>Área</th>
            <th>Fecha y Hora Inicio</th>
            <th>Fecha y Hora Fin</th>
            <th>Categoría</th>
            <th>Horas</th>
          </tr>

        </thead>
        <tbody>


          {registrosExtras.length > 0 ? (
            registrosExtras.map((registro, index) => (
              <tr key={index}>
                <td>{registro.Trabajador?.nombre} {registro.Trabajador?.apellido}</td>
                <td>{registro.Trabajador?.cc}</td>
                <td>{registro.Trabajador?.area}</td>
                <td>{registro.Turno?.horaInicio}</td>
                <td>{registro.Turno?.horaFin}</td>
                <td>{registro.categoria}</td>
                <td>{registro.horas}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="18" className="no-trabajadores">
                <p>No hay registro de horas extras.</p>
                <span>Modifica los filtros o agrega trabajadores y turnos para visualizar el registro de horas extras.</span>
              </td>
            </tr>
          )}

        </tbody>
      </table>
    </div>
  );
}

export default RegistroHorasExtras;