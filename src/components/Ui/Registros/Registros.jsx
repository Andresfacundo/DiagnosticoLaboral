import React, { useState, useEffect } from "react";
import axios from "axios";
import del from "../../../../public/delete.svg";
import "./Registros.css";


const API_URL = import.meta.env.VITE_API_URL;

const Registros = () => {
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState({ documento: "", razonSocial: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState(null);
  const [detallesDiagnostico, setDetallesDiagnostico] = useState(null);  
  
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        const [empleadoresResponse, diagnosticosResponse ] = await Promise.all([
          axios.get(`${API_URL}/api/empleadores`),
          axios.get(`${API_URL}/api/diagnostico`),            
        ]);
        
        const empleador = empleadoresResponse.data;       

        const response = diagnosticosResponse.data.map((diagnostico) => {
          const empleadorEncontrado = empleador.find((e) => e.id === diagnostico.id);
          return {
            ...diagnostico,
            empleador: empleadorEncontrado || {},
            cumplimiento: diagnostico.resultado?.porcentajeGeneral || 0,
          };
        });
    
        setHistorial(response);              
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el historial:", err);
        setError("Error al cargar el historial. Por favor intente nuevamente.");
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const eliminarDiagnostico = async (id) => {
    const confirmacion = window.confirm("¿Está seguro de que desea eliminar este diagnóstico?");
    if(!confirmacion) return;
    try {
      await axios.delete(`${API_URL}/api/diagnostico/${id}`);
      setHistorial((prevHistorial) => prevHistorial.filter((item) => item.id !== id));
    }catch (error) {
      console.error("Error al eliminar el diagnóstico:", error);
      setError("Error al eliminar el diagnóstico. Por favor intente nuevamente.");
    }
  }

  const cargarDetallesDiagnostico = async (diagnosticoId) => {
    try {
      setLoading(true);
      
      // Obtener el diagnóstico específico por su ID
      const diagnosticoResponse = await axios.get(`${API_URL}/api/diagnostico/${diagnosticoId}`);
      const diagnosticoData = diagnosticoResponse.data;
      
      if (!diagnosticoData) {
        throw new Error("No se encontró el diagnóstico solicitado");
      }
      
      setDiagnosticoSeleccionado(diagnosticoId);
      setDetallesDiagnostico(diagnosticoData.resultado);
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
    // Validar que las propiedades existan antes de usarlas
    const identificacion = resultado.empleador?.identificacion || 
                          resultado.identificacion || 
                          "";
    const nombres = resultado.empleador?.nombres || 
                   resultado.nombres || 
                   resultado.razonSocial || 
                   "";
    
    const coincideDocumento = identificacion
      .toLowerCase()
      .includes(filtro.documento.toLowerCase());
    const coincideRazonSocial = nombres
      .toLowerCase()
      .includes(filtro.razonSocial.toLowerCase());
    
    return coincideDocumento && coincideRazonSocial;
  });  

  // Función para volver a la lista de diagnósticos
  const volverALista = () => {
    setDiagnosticoSeleccionado(null);
    setDetallesDiagnostico(null);
  };

  // Función para formatear fecha
  const formatearFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return fechaStr || "Fecha no disponible";
    }
  };

  // Función para determinar el nivel de cumplimiento
  const getNivelCumplimiento = (porcentaje) => {
    if (porcentaje >= 80) return "alto";
    if (porcentaje >= 60) return "medio";
    return "bajo";
  };

  if (loading) return (
    <div className="loading-container">
      <p>Cargando información...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="btn-reintentar">
        Reintentar
      </button>
    </div>
  );

  // Si hay un diagnóstico seleccionado, mostrar sus detalles
  if (diagnosticoSeleccionado && detallesDiagnostico) {
    // Encontrar el diagnóstico en el historial
    const diagnosticoActual = historial.find(diag => diag.id === diagnosticoSeleccionado);
    const nombreEmpleador = diagnosticoActual?.empleador?.nombres || 
                          diagnosticoActual?.nombres || 
                          "Empleador";
    const porcentajeGeneral = Math.round(detallesDiagnostico.porcentajeGeneral);
    const nivelCumplimiento = getNivelCumplimiento(porcentajeGeneral);
    
    return (
      <div className="detalles-diagnostico-container">
        <button onClick={volverALista} className="btn-volver">← Volver a la lista</button>
        
        <h1>Detalles de Diagnóstico: {nombreEmpleador}</h1>
        <p className="fecha-diagnostico">
          Realizado el: {formatearFecha(diagnosticoActual?.creadoEn || diagnosticoActual?.fecha)}
        </p>
        
        <div className="resumen-diagnostico">
          <h2>Resumen de Cumplimiento</h2>
          <div className="estadisticas-generales">
            <div className="estadistica">
              <span className={`valor nivel-${nivelCumplimiento}`}>{porcentajeGeneral}%</span>
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
                
          {detallesDiagnostico.areasRiesgo && detallesDiagnostico.areasRiesgo.length > 0 && (
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
        {detallesDiagnostico.categoriasAnalizadas && Object.entries(detallesDiagnostico.categoriasAnalizadas).map(([categoria, datos], idx) => {
          const porcentajeCategoria = Math.round(datos.porcentaje);
          const nivelCategoria = getNivelCumplimiento(porcentajeCategoria);
          
          return (
            <div key={idx} className={`categoria-detalle nivel-${nivelCategoria}`}>
              <h3>{categoria} - {porcentajeCategoria}% de cumplimiento</h3>
              <table className="tabla-preguntas">
                <thead>
                  <tr>
                    <th>Pregunta</th>
                    <th>Respuesta</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.preguntas.map((pregunta) => (
                    <tr key={pregunta.id}>
                      <td>{pregunta.texto}</td>
                      <td>{pregunta.respuesta}</td>
                      <td>{pregunta.comentario || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
            </div>

            
          );
        })}

        <div className="diagnostico-acciones">
        <button 
          className="btn-imprimir"
          onClick={() => window.print()}
        >
          Imprimir Resultados
        </button>

      </div>
      </div>
    );
  }

  // Mostrar la lista de diagnósticos
  return (
    <div className="historial-container">
      <h1>Historial de Diagnósticos</h1>
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
              resultadosFiltrados.map((diagnostico, index) => {
                const porcentaje = Math.round(diagnostico.resultado?.porcentajeGeneral || 
                                diagnostico.porcentajeGeneral || 
                                diagnostico.cumplimiento || 0);
                                
                const nombreEmpleador = diagnostico.empleador?.nombres || 
                                      diagnostico.nombres || 
                                      "No disponible";
                                      
                const identificacion = diagnostico.empleador?.identificacion || 
                                     diagnostico.identificacion || 
                                     "No disponible";
                                     
                const fecha = diagnostico.creadoEn || diagnostico.fecha || new Date();

                const trabajadores = diagnostico.empleador?.trabajadores ||
                                  diagnostico.trabajadores || 
                                  "No disponible";
                
                const nivelCumplimiento = getNivelCumplimiento(porcentaje);
                
                return (
                  <tr key={index} data-cumplimiento={nivelCumplimiento}>
                    <td>{nombreEmpleador}</td>
                    <td>{identificacion}</td>
                    <td>{trabajadores}</td>
                    <td data-value={porcentaje}>{porcentaje}%</td>
                    <td>{formatearFecha(fecha)}</td>
                    <td className="acciones">
                      {historial.map((item) => 
                        item.id === diagnostico.id && (
                          <button 
                            key={item.id} 
                            onClick={() => eliminarDiagnostico(item.id)}                             
                            className="btn-elimina"
                          >
                            <img src={del} alt="" />
                          </button>
                        )
                      )}
                      <button 
                        onClick={() => cargarDetallesDiagnostico(diagnostico.id)} 
                        className="btn-ver-detalles"
                      >
                        Ver detalles
                      </button>
                   
                    </td>
                  </tr>
                );
              })
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