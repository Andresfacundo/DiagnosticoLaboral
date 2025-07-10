import React, { useState, useEffect } from "react";
import axios from "axios";
import del from "../../../../public/delete.svg";
import contactarEmpleador from "../ContactarEmpleador/ContactarEmpleador";
import "./Registros.css";
import SpinnerTimed from "../SpinnerTimed/SpinnerTimed";
import authService from "../../../Services/authService";

const API_URL = import.meta.env.VITE_API_URL;

const Registros = () => {
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState({ documento: "", razonSocial: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState(null);
  const [detallesDiagnostico, setDetallesDiagnostico] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [mostrarSpinner, setMostrarSpinner] = useState(true);
  
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setMostrarSpinner(true);        
        const [empleadoresResponse, diagnosticosResponse, categoriasResponse] = await Promise.all([
          axios.get(`${API_URL}/api/empleadores`),
          axios.get(`${API_URL}/api/diagnostico`),
          axios.get(`${API_URL}/api/categorias`) // Obtener categorías
        ]);
        
        const empleador = empleadoresResponse.data;
        setCategorias(categoriasResponse.data); // Guardar categorías

        const response = diagnosticosResponse.data.map((diagnostico) => {
          const empleadorEncontrado = diagnostico.empleadorId
          ? empleador.find((e) => e.id === diagnostico.empleadorId)
          : null;
          return {
            ...diagnostico,
            empleador: empleadorEncontrado || {},
            cumplimiento: diagnostico.resultado?.porcentajeGeneral || 0,
          };
        });
    
        setHistorial(response);                      

      } catch (err) {
        console.error("Error al cargar el historial:", err);
        setError("Error al cargar el historial. Por favor intente nuevamente.");        
      }finally{
        setMostrarSpinner(false);
      }
    };

    fetchHistorial();
  }, []);

  const eliminarDiagnostico = async (id) => {
    const token = authService.getToken();
    const confirmacion = window.confirm("¿Está seguro de que desea eliminar este diagnóstico?");
    if(!confirmacion) return;
    try {
      await axios.delete(`${API_URL}/api/diagnostico/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setHistorial((prevHistorial) => prevHistorial.filter((item) => item.id !== id));
    }catch (error) {
      console.error("Error al eliminar el diagnóstico:", error);
      setError("Error al eliminar el diagnóstico. Por favor intente nuevamente.");
    }
  }

  const cargarDetallesDiagnostico = async (diagnosticoId) => {
    try {
      setMostrarSpinner(true);
      
      const diagnosticoResponse = await axios.get(`${API_URL}/api/diagnostico/${diagnosticoId}`);
      const diagnosticoData = diagnosticoResponse.data;
      
      if (!diagnosticoData) {
        throw new Error("No se encontró el diagnóstico solicitado");
      }
      
      setDiagnosticoSeleccionado(diagnosticoId);
      setDetallesDiagnostico(diagnosticoData.resultado);
      setMostrarSpinner(false);
    } catch (err) {
      console.error("Error al cargar detalles del diagnóstico:", err);
      setError("Error al cargar los detalles. Por favor intente nuevamente.");
      setMostrarSpinner(false);
    }
  };

  // Función para obtener el nombre de una categoría por su ID
  const obtenerNombreCategoria = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === categoriaId || cat.id === parseInt(categoriaId));
    return categoria ? categoria.nombre : categoriaId; // Si no encuentra la categoría, devuelve el ID
  };

  // Función para procesar áreas de riesgo (convertir IDs a nombres)
  const procesarAreasRiesgo = (areasRiesgo) => {
    if (!areasRiesgo || !Array.isArray(areasRiesgo)) return [];
    return areasRiesgo.map(area => {
      // Si el área ya es un nombre (string sin números), devolverla tal como está
      if (isNaN(area)) return area;
      // Si es un ID numérico, convertirlo al nombre
      return obtenerNombreCategoria(area);
    });
  };

  // Función para procesar categorías analizadas (convertir keys de IDs a nombres)
  const procesarCategoriasAnalizadas = (categoriasAnalizadas) => {
    if (!categoriasAnalizadas) return {};
    
    const categoriasConNombres = {};
    
    Object.entries(categoriasAnalizadas).forEach(([key, datos]) => {
      // Si la key ya es un nombre (no es numérico), mantenerla
      const nombreCategoria = isNaN(key) ? key : obtenerNombreCategoria(key);
      categoriasConNombres[nombreCategoria] = datos;
    });
    
    return categoriasConNombres;
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  const resultadosFiltrados = historial.filter((resultado) => {
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

  const volverALista = () => {
    setDiagnosticoSeleccionado(null);
    setDetallesDiagnostico(null);
  };

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

  const getNivelCumplimiento = (porcentaje) => {
    if (porcentaje >= 80) return "alto";
    if (porcentaje >= 60) return "medio";
    return "bajo";
  };

 if ( mostrarSpinner) {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SpinnerTimed />
    </div>
  );
}
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
    const diagnosticoActual = historial.find(diag => diag.id === diagnosticoSeleccionado);
    const nombreEmpleador = diagnosticoActual?.empleador?.nombres || 
                          diagnosticoActual?.nombres || 
                          "Empleador";
    const porcentajeGeneral = Math.round(detallesDiagnostico.porcentajeGeneral);
    const nivelCumplimiento = getNivelCumplimiento(porcentajeGeneral);
    
    // Procesar áreas de riesgo y categorías analizadas
    const areasRiesgoConNombres = procesarAreasRiesgo(detallesDiagnostico.areasRiesgo);
    const categoriasAnalizadasConNombres = procesarCategoriasAnalizadas(detallesDiagnostico.categoriasAnalizadas);
    
    const nombreEmpresa = diagnosticoActual?.empleador?.nombres || "No disponible";
    const identificacionEmpresa = diagnosticoActual?.empleador?.identificacion || "No disponible";
    const tipoIdentificacion = diagnosticoActual?.empleador?.tipoDocumento || "";
    const diligenciador = diagnosticoActual?.empleador?.nombreDiligenciador || "No disponible";
    const telefono = diagnosticoActual?.empleador?.telefono || "No disponible";
    const email = diagnosticoActual?.empleador?.email || "No disponible";
    const trabajadores = diagnosticoActual?.empleador?.trabajadores || "No disponible";

    return (
      <div className="detalles-diagnostico-container">
        <button onClick={volverALista} className="btn-volver">← Volver a la lista</button>

        
        <h1>Detalles de Diagnóstico: {nombreEmpleador}</h1>
                    <div className="empresa-datos">
              <div className="dato-empresa">
                <span className="dato-label">Empleador: <span className="dato-valor">{nombreEmpresa}</span></span>
              </div>
              <div className="dato-empresa">
                <span className="dato-label">Tipo de identificación: <span className="dato-valor">{tipoIdentificacion}</span></span>
              </div>
              <div className="dato-empresa">
                <span className="dato-label">Número de identificación: <span className="dato-valor">{identificacionEmpresa}</span></span>
              </div>
              <div className="dato-empresa">
                <span className="dato-label">Diligenciador: <span className="dato-valor">{diligenciador}</span></span>
              </div>
              <div className="dato-empresa">
                <span className="dato-label">Correo electrónico: <span className="dato-valor">{email}</span></span>
              </div>
              <div className="dato-empresa">
                <span className="dato-label">Telefono: <span className="dato-valor">{telefono}</span></span>
              </div>
              <div className="dato-empresa">
                <span className="dato-label">Número de trabajadores: <span className="dato-valor">{trabajadores}</span></span>
                {/* <span className="dato-label">Fecha: <span className="dato-valor">{resultados.fecha}</span></span> */}
              </div>
            </div>
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
                
          {areasRiesgoConNombres && areasRiesgoConNombres.length > 0 && (
            <div className="areas-riesgo">
              <h3>Áreas de Riesgo</h3>
              <ul>
                {areasRiesgoConNombres.map((area, idx) => (
                  <li key={idx}>{area}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <h2>Detalle por Categorías</h2>
        {Object.entries(categoriasAnalizadasConNombres).map(([categoria, datos], idx) => {
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
                      <button onClick={() => contactarEmpleador(diagnostico)} className="btn-ver-detalles">
                        Contactar
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