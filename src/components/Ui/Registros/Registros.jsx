import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HistorialResultados.css";

const API_URL = import.meta.env.VITE_API_URL;

const Registros = () => {
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState({ documento: "", razonSocial: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/empleadores`);
        setHistorial(response.data);
        // console.log("Historial de resultados:", response.data[0].identificacion);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el historial:", err);
        setError("Error al cargar el historial. Por favor intente nuevamente.");
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  const resultadosFiltrados = historial.filter((resultado) => {
    const coincideDocumento = resultado.identificacion
    console.log('resultado',coincideDocumento)
      // .toLowerCase()
      // .includes(filtro.documento.toLowerCase());
    const coincideRazonSocial = resultado.nombres
    console.log('resultadosasdasdd',coincideRazonSocial)
      // .toLowerCase()
      // .includes(filtro.razonSocial.toLowerCase());
    return coincideDocumento && coincideRazonSocial;
  });

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="historial-container">
      <h1>Historial de Resultados</h1>
      <div className="filtros">
        <input
          type="text"
          name="documento"
          placeholder="Filtrar por número de documento"
          value={filtro.documento}
          onChange={handleFiltroChange}
        />
        <input
          type="text"
          name="razonSocial"
          placeholder="Filtrar por razón social"
          value={filtro.razonSocial}
          onChange={handleFiltroChange}
        />
      </div>
      <div className="tabla-resultados">
        <table>
          <thead>
            <tr>
              <th>Razón Social</th>
              <th>Número de Documento</th>
              <th>Porcentaje de Cumplimiento</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {resultadosFiltrados.length > 0 ? (
              resultadosFiltrados.map((resultado, index) => (
                <tr key={index}>
                  <td>{resultado.empleador.nombres}</td>
                  <td>{resultado.empleador.identificacion}</td>
                  <td>{Math.round(resultado.porcentajeCumplimiento)}%</td>
                  <td>{resultado.fecha}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No se encontraron resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Registros;