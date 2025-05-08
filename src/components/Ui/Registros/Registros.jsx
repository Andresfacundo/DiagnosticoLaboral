import React, { useState, useEffect } from "react";
import axios from "axios";
import procesarDatos from "../../../utils/diagnosticoUtils";
import "./Registros.css";

const API_URL = import.meta.env.VITE_API_URL;

const Registros = () => {
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState({ documento: "", razonSocial: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState(null);
  const [detallesDiagnostico, setDetallesDiagnostico] = useState(null);
  const [resultados, setResultados] = useState({
      porcentajeCumplimiento: 0,
      empleador: null,
      respuestas: [],
      categorias: {},
      loading: true,
      error: null,
      fecha: new Date().toLocaleString()
    });
  

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const empleadorId = JSON.parse(localStorage.getItem("empleadorId"));
        const response = await axios.get(`${API_URL}/api/empleadores`);
        console.log("Empleadores:", response.data);
        const historialConCumplimiento = response.data.map((empleador) => ({
          ...empleador,
          cumplimiento: Math.round(porcentajeCumplimiento), // Ejemplo: reemplaza con el cálculo real
        }));     
        
        setHistorial(historialConCumplimiento);
        if (!empleadorId) {
          setResultados(prev => ({
            ...prev,
            loading: false,
            error: "No se encontró información del empleador. Por favor regrese al inicio."
          }));
          return;
        }

        const empleadorResponse = await axios.get(`${API_URL}/api/empleadores/${empleadorId}`);
        const empleadorInfo = empleadorResponse.data;

        let respuestas = JSON.parse(localStorage.getItem("respuestas"));
        
        if (!respuestas) {
          const respuestasResponse = await axios.get(`${API_URL}/api/respuestas`);
          const respuestasEmpleador = respuestasResponse.data.find(r => r.empleadorId === empleadorId);
          respuestas = respuestasEmpleador ? respuestasEmpleador.respuestas : [];
        }
        
        const preguntasResponse = await axios.get(`${API_URL}/api/preguntas`);
        const preguntas = preguntasResponse.data;
        
        const datosAnalizados = procesarDatos(respuestas, preguntas);
        const porcentajeCumplimiento = datosAnalizados.porcentajeGeneral;
        console.log('r',datosAnalizados);
        const cumplimiento = datosAnalizados.porcentajeGeneral;
        
        setResultados({
          porcentajeCumplimiento: datosAnalizados.porcentajeGeneral,
          empleador: empleadorInfo,
          respuestas: respuestas,
          categorias: datosAnalizados.categoriasAnalizadas,
          loading: false,
          error: null,
          fecha: new Date().toLocaleString(),
          areasRiesgo: datosAnalizados.areasRiesgo
        })
        
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el historial:", err);
        setError("Error al cargar el historial. Por favor intente nuevamente.");
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const cargarDetallesDiagnostico = async (empleadorId) => {
    try {
      setLoading(true);
      const respuestasResponse = await axios.get(`${API_URL}/api/respuestas`);
      
      const preguntasResponse = await axios.get(`${API_URL}/api/preguntas`);

      
      const respuestas = respuestasResponse.data;
      const preguntas = preguntasResponse.data;

      const resultadosProcesados = procesarDatos(respuestas, preguntas);
      
      setDiagnosticoSeleccionado(empleadorId);
      setDetallesDiagnostico(resultadosProcesados);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar detalles del diagnóstico:", err);
      setError("Error al cargar los detalles. Por favor intente nuevamente.");
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  const resultadosFiltrados = historial.filter((resultado) => {
    const coincideDocumento = resultado.identificacion
      .toLowerCase()
      .includes(filtro.documento.toLowerCase());
    const coincideRazonSocial = resultado.nombres
      .toLowerCase()
      .includes(filtro.razonSocial.toLowerCase());
    return coincideDocumento && coincideRazonSocial;
  });
  console.log("Resultados filtrados:", resultadosFiltrados);

  // Función para volver a la lista de empleadores
  const volverALista = () => {
    setDiagnosticoSeleccionado(null);
    setDetallesDiagnostico(null);
  };

  if (loading) return <p>Cargando información...</p>;
  if (error) return <p>{error}</p>;

  // Si hay un diagnóstico seleccionado, mostrar sus detalles
  if (diagnosticoSeleccionado && detallesDiagnostico) {
    const empleador = historial.find(emp => emp.id === diagnosticoSeleccionado);
    
    return (
      <div className="detalles-diagnostico-container">
        <button onClick={volverALista} className="btn-volver">← Volver a la lista</button>
        
        <h1>Detalles de Diagnóstico: {empleador?.nombres}</h1>
        <div className="resumen-diagnostico">
          <h2>Resumen de Cumplimiento</h2>
          <div className="estadisticas-generales">
            <div className="estadistica">
              <span className="valor">{Math.round(detallesDiagnostico.porcentajeGeneral)}%</span>
              <span className="etiqueta">Cumplimiento General</span>
            </div>
            <div className="estadistica">
              <span className="valor">{detallesDiagnostico.puntajeTotal}</span>
              <span className="etiqueta">Puntaje obtenido de {detallesDiagnostico.puntajeMaximo}</span>
            </div>
            <div className="estadistica">
              <span className="valor">{detallesDiagnostico.totalPreguntas}</span>
              <span className="etiqueta">Total de Preguntas</span>
            </div>
          </div>
          
          <div className="distribucion-respuestas">
            <h3>Distribución de Respuestas</h3>
            <div className="conteo-respuestas">
              <div className="respuesta si">
                <span className="contador">{detallesDiagnostico.cumplimiento}</span>
                <span className="tipo">Sí</span>
              </div>
              <div className="respuesta no">
                <span className="contador">{detallesDiagnostico.incumplimiento}</span>
                <span className="tipo">No</span>
              </div>
              <div className="respuesta parcial">
                <span className="contador">{detallesDiagnostico.parcialmente}</span>
                <span className="tipo">Parcialmente</span>
              </div>
              <div className="respuesta na">
                <span className="contador">{detallesDiagnostico.noAplica}</span>
                <span className="tipo">No Aplica</span>
              </div>
            </div>
          </div>
          
          {detallesDiagnostico.areasRiesgo.length > 0 && (
            <div className="areas-riesgo">
              <h3>Áreas de Riesgo</h3>
              <ul>
                {detallesDiagnostico.areasRiesgo.map((area, idx) => (
                  <li key={idx}>{area}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <h2>Detalle por Categorías</h2>
        {Object.entries(detallesDiagnostico.categoriasAnalizadas).map(([categoria, datos], idx) => (
          <div key={idx} className="categoria-detalle">
            <h3>{categoria} - {Math.round(datos.porcentaje)}% de cumplimiento</h3>
            <table className="tabla-preguntas">
              <thead>
                <tr>
                  <th>Pregunta</th>
                  <th>Respuesta</th>
                  <th>Comentario</th>
                  <th>Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {datos.preguntas.map((pregunta) => (
                  <tr key={pregunta.id}>
                    <td>{pregunta.texto}</td>
                    <td>{pregunta.respuesta}</td>
                    <td>{pregunta.comentario || "-"}</td>
                    <td>{porcentajeCumplimiento}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

  // Mostrar la lista de empleadores
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
              <th>Número de trabajadores</th>
              <th>Porcentaje de Cumplimiento</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultadosFiltrados.length > 0 ? (
              resultadosFiltrados.map((resultado, index) => (
                <tr key={index}>
                  <td>{resultado.nombres}</td>
                  <td>{resultado.identificacion}</td>
                  <td>{resultado.trabajadores}</td>
                  <td>{resultado.cumplimiento}%</td>
                  <td>{resultado.fecha}</td>
                  <td>
                    <button 
                      onClick={() => cargarDetallesDiagnostico(resultado.id)} 
                      className="btn-ver-detalles"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No se encontraron resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Registros;