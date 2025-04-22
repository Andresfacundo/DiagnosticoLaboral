import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Resultados.css";
const API_URL = import.meta.env.VITE_API_URL

const Resultados = () => {
  const navigate = useNavigate();
  const [resultados, setResultados] = useState({
    porcentajeCumplimiento: 0,
    empleador: null,
    respuestas: [],
    categorias: {},
    loading: true,
    error: null,
    fecha: new Date().toLocaleString()
  });
  console.log("Resultados iniciales:", resultados);
  
  // Colores para los gráficos
  const COLORES_ESTADO = {
    Si: "#4CAF50", // Verde para cumplimiento
    No: "#F44336", // Rojo para incumplimiento
    NA: "#9E9E9E", // Gris para no aplicable
    Parcialmente: "#FFC107"
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener información del empleador del localStorage
        const empleadorId = JSON.parse(localStorage.getItem("empleadorId"));
        
        if (!empleadorId) {
          setResultados(prev => ({
            ...prev,
            loading: false,
            error: "No se encontró información del empleador. Por favor regrese al inicio."
          }));
          return;
        }

        // Obtener empleador desde el backend (adaptado a la nueva API)
        const empleadorResponse = await axios.get(`${API_URL}/api/empleadores/${empleadorId}`);
        const empleadorInfo = empleadorResponse.data;

        // Obtener respuestas desde el localStorage o el servidor
        let respuestas = JSON.parse(localStorage.getItem("respuestas"));
        
        if (!respuestas) {
          // Adaptación: Obtener respuestas específicas del empleador
          // Como no hay un endpoint específico por empleadorId, obtenemos todas y filtramos
          const respuestasResponse = await axios.get(`${API_URL}/api/respuestas`);
          // Filtramos las respuestas que corresponden al empleador actual
          const respuestasEmpleador = respuestasResponse.data.find(r => r.empleadorId === empleadorId);
          respuestas = respuestasEmpleador ? respuestasEmpleador.respuestas : [];
        }

        // Obtener preguntas para asociarlas con las respuestas
        const preguntasResponse = await axios.get(`${API_URL}/api/preguntas`);
        const preguntas = preguntasResponse.data;

        // Procesar datos
        const datosAnalizados = procesarDatos(respuestas, preguntas);
        
        setResultados({
          porcentajeCumplimiento: datosAnalizados.porcentajeGeneral,
          empleador: empleadorInfo,
          respuestas: respuestas,
          categorias: datosAnalizados.categoriasAnalizadas,
          loading: false,
          error: null,
          fecha: new Date().toLocaleString(),
          areasRiesgo: datosAnalizados.areasRiesgo
        });
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setResultados(prev => ({
          ...prev,
          loading: false,
          error: "Error al cargar los resultados. Por favor intente nuevamente."
        }));
      }
    };

    fetchData();
  }, []);

  // Función para procesar los datos adaptada
  const procesarDatos = (respuestas, preguntas) => {
    const respuestasConDetalles = respuestas.map(respuesta => {
        const pregunta = preguntas.find(p => p.id === respuesta.id);
        return { ...respuesta, pregunta };
    });

    const categoriasUnicas = [...new Set(preguntas.map(p => p.categoria))];
    const categoriasAnalizadas = {};
    const puntajePorCategoria = [];

    categoriasUnicas.forEach(categoria => {
        const respuestasCat = respuestasConDetalles.filter(r => r.pregunta && r.pregunta.categoria === categoria);

        const conteo = {
            Si: 0,
            No: 0,
            NA: 0,
            Parcialmente: 0 // Agregamos el conteo para "Parcialmente"
        };

        let puntajeObtenido = 0;
        let puntajePosible = 0;
        const preguntasCategoria = [];

        respuestasCat.forEach(r => {
            if (r.respuesta === "Sí" || r.respuesta === "Si") {
                conteo.Si++;
                puntajeObtenido += r.pregunta.respuestas?.Si || r.pregunta.peso;
            } else if (r.respuesta === "No") {
                conteo.No++;
                puntajeObtenido += r.pregunta.respuestas?.No || 0;
            } else if (r.respuesta === "No aplica") {
                conteo.NA++;
                puntajeObtenido += r.pregunta.respuestas?.["No aplica"] || 0;
            } else if (r.respuesta === "Parcialmente") {
                conteo.Parcialmente++;
                puntajeObtenido += (r.pregunta.respuestas?.Parcialmente || r.pregunta.peso * 0.5); // Asignamos un puntaje parcial
            }

            puntajePosible += r.pregunta.respuestas?.Si || r.pregunta.peso;

            preguntasCategoria.push({
                id: r.pregunta.id,
                texto: r.pregunta.texto,
                respuesta: r.respuesta,
                comentario: r.comentario || "",
                valorRespuesta: r.respuesta === "Sí" || r.respuesta === "Si"
                    ? (r.pregunta.respuestas?.Si || r.pregunta.peso)
                    : (r.pregunta.respuestas?.[r.respuesta] || 0),
                pesoTotal: r.pregunta.respuestas?.Si || r.pregunta.peso,
                cumplimiento: r.respuesta === "Sí" || r.respuesta === "Si" ? 100 : r.respuesta === "Parcialmente" ? 50 : 0
            });
        });

        const porcentajeCumplimiento = puntajePosible > 0
            ? (puntajeObtenido / puntajePosible) * 100
            : 0;

        categoriasAnalizadas[categoria] = {
            total: puntajePosible,
            cumplimiento: puntajeObtenido,
            porcentaje: porcentajeCumplimiento,
            preguntas: preguntasCategoria,
            conteo: conteo
        };

        puntajePorCategoria.push({
            name: categoria,
            value: porcentajeCumplimiento,
            puntajeObtenido,
            puntajePosible,
            riesgo: porcentajeCumplimiento < 70
        });
    });

    const totalPreguntas = respuestas.length;
    const cumplimiento = respuestas.filter(r => r.respuesta === "Sí" || r.respuesta === "Si").length;
    const incumplimiento = respuestas.filter(r => r.respuesta === "No").length;
    const noAplica = respuestas.filter(r => r.respuesta === "No aplica").length;
    const parcialmente = respuestas.filter(r => r.respuesta === "Parcialmente").length;

    let puntajeTotal = 0;
    let puntajeMaximo = 0;

    respuestasConDetalles.forEach(r => {
        if (r.pregunta) {
            if (r.respuesta === "Sí" || r.respuesta === "Si") {
                puntajeTotal += r.pregunta.respuestas?.Si || r.pregunta.peso;
            } else if (r.respuesta === "No") {
                puntajeTotal += r.pregunta.respuestas?.No || 0;
            } else if (r.respuesta === "No aplica") {
                puntajeTotal += r.pregunta.respuestas?.["No aplica"] || 0;
            } else if (r.respuesta === "Parcialmente") {
                puntajeTotal += (r.pregunta.respuestas?.Parcialmente || r.pregunta.peso * 0.5);
            }

            puntajeMaximo += r.pregunta.respuestas?.Si || r.pregunta.peso;
        }
    });

    const porcentajeGeneral = puntajeMaximo > 0
        ? (puntajeTotal / puntajeMaximo) * 100
        : 0;

    const areasRiesgo = puntajePorCategoria
        .filter(cat => cat.riesgo)
        .map(cat => cat.name);

    return {
        totalPreguntas,
        cumplimiento,
        incumplimiento,
        noAplica,
        parcialmente, // Incluimos el conteo de "Parcialmente"
        puntajeTotal,
        puntajeMaximo,
        porcentajeGeneral,
        areasRiesgo,
        categoriasAnalizadas,
        respuestasDetalladas: respuestasConDetalles
    };
};
  const obtenerColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 80) return "#4CAF50"; // Verde
    if (porcentaje >= 60) return "#FFC107"; // Amarillo
    if (porcentaje >= 40) return "#FF9800"; // Naranja
    return "#F44336"; // Rojo
  };

  const renderizarGraficoDona = (porcentaje, tamaño = 120) => {
    const radio = tamaño / 2;
    const circunferencia = 2 * Math.PI * (radio - 10);
    const porcentajeCompletado = circunferencia * (1 - porcentaje / 100);
    const color = obtenerColorPorcentaje(porcentaje);

    return (
      <svg width={tamaño} height={tamaño} viewBox={`0 0 ${tamaño} ${tamaño}`}>
        <circle
          cx={radio}
          cy={radio}
          r={radio - 10}
          fill="transparent"
          stroke="#f0f0f0"
          strokeWidth="8"
        />
        <circle
          cx={radio}
          cy={radio}
          r={radio - 10}
          fill="transparent"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circunferencia}
          strokeDashoffset={porcentajeCompletado}
          transform={`rotate(-90 ${radio} ${radio})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#333"
        >
          {Math.round(porcentaje)}%
        </text>
      </svg>
    );
  };

  const identificarContingencias = () => {
    if (!resultados.areasRiesgo) return [];
    
    const contingencias = [];
    resultados.areasRiesgo.forEach(categoria => {
      if (resultados.categorias[categoria]) {
        const preguntasConContingencia = resultados.categorias[categoria].preguntas
          .filter(p => p.cumplimiento < 70)
          .map(p => ({
            texto: p.texto,
            respuesta: p.respuesta,
            comentario: p.comentario, // Incluimos el comentario
            cumplimiento: p.cumplimiento
          }));

        contingencias.push({
          categoria,
          porcentaje: resultados.categorias[categoria].porcentaje,
          preguntas: preguntasConContingencia
        });
      }
    });

    return contingencias;
  };

  // Función para mostrar todas las preguntas con sus comentarios por categoría
  const mostrarTodasLasPreguntas = () => {
    return Object.entries(resultados.categorias).map(([categoria, datos]) => (
      <div key={categoria} className="categoria-detalle">
        <h3>{categoria}</h3>
        <div className="categoria-preguntas-lista">
          {datos.preguntas.map((pregunta, idx) => (
            <div key={idx} className="pregunta-detalle-item">
              <div className="pregunta-detalle-texto">{pregunta.texto}</div>
              <div className="pregunta-detalle-respuesta">
                <span className="etiqueta">Respuesta:</span> 
                <span 
                  className="valor-respuesta" 
                  style={{ color: pregunta.respuesta === "Sí" || pregunta.respuesta === "Si" 
                    ? COLORES_ESTADO.Si 
                    : pregunta.respuesta === "No" 
                      ? COLORES_ESTADO.No 
                      : COLORES_ESTADO.NA 
                  }}
                >
                  {pregunta.respuesta}
                </span>
              </div>
              {pregunta.comentario && (
                <div className="pregunta-detalle-comentario">
                  <span className="etiqueta">Comentario:</span> 
                  <span className="valor-comentario">{pregunta.comentario}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  if (resultados.loading) {
    return (
      <div className="diagnostico-loading">
        <h2>Cargando resultados...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (resultados.error) {
    return (
      <div className="diagnostico-error">
        <h2>Error</h2>
        <p>{resultados.error}</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  const contingencias = identificarContingencias();

  // Obtener la información del empleador adaptada a la nueva estructura de datos
  const nombreEmpresa = resultados.empleador?.nombres || "No disponible";
  const identificacionEmpresa = resultados.empleador?.identificacion || "No disponible";
  const tipoIdentificacion = resultados.empleador?.tipoDocumento || "";

  

  return (
    <div className="diagnostico-container">
      {/* Encabezado con información de la empresa y resumen */}
      <div className="diagnostico-header">
        <div className="empresa-info">
          <h1>Diagnóstico de Cumplimiento</h1>
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
              <span className="dato-label">Fecha: <span className="dato-valor">{resultados.fecha}</span></span>
            </div>
          </div>
        </div>
        
        <div className="resumen-cumplimiento">
          <div className="grafico-principal">
            {renderizarGraficoDona(resultados.porcentajeCumplimiento, 150)}
          </div>
          <div className="resumen-texto">
            <h2>Cumplimiento Global</h2>
            <div className="estado-cumplimiento">
              <span 
                className="estado-indicador"
                style={{ backgroundColor: obtenerColorPorcentaje(resultados.porcentajeCumplimiento) }}
              ></span>
              <span className="estado-texto">
                {resultados.porcentajeCumplimiento >= 80
                  ? "Cumplimiento Adecuado"
                  : resultados.porcentajeCumplimiento >= 60
                  ? "Requiere Mejoras"
                  : "Alto Riesgo de Incumplimiento"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección principal con dos columnas */}
      <div className="diagnostico-contenido">
        {/* Columna izquierda: Categorías */}
        <div className="columna-categorias">
          <h2>Cumplimiento por Categoría</h2>
          <div className="categorias-grid">
            {Object.entries(resultados.categorias).map(([categoria, datos]) => (
              <div key={categoria} className="categoria-card">
                <div className="categoria-header">
                  <h3>{categoria}</h3>
                  <div className="categoria-porcentaje" style={{ color: obtenerColorPorcentaje(datos.porcentaje) }}>
                    {Math.round(datos.porcentaje)}%
                  </div>
                </div>
                
                <div className="categoria-body">
                  <div className="categoria-grafico">
                    {renderizarGraficoDona(datos.porcentaje, 80)}
                  </div>
                  <div className="categoria-stats">
                    <div className="categoria-estado" style={{ color: obtenerColorPorcentaje(datos.porcentaje) }}>
                      {datos.porcentaje >= 80 
                        ? "Cumplimiento adecuado" 
                        : datos.porcentaje >= 60
                        ? "Requiere mejoras"
                        : "Alto riesgo"}
                    </div>
                    <div className="respuestas-distribucion">
                      <div className="respuesta-tipo">
                        <span className="respuesta-color" style={{backgroundColor: COLORES_ESTADO.Si}}></span>
                        <span>Si: {datos.conteo.Si}</span>
                      </div>
                      <div className="respuesta-tipo">
                        <span className="respuesta-color" style={{backgroundColor: COLORES_ESTADO.Parcialmente}}></span>
                        <span>Parcialmente: {datos.conteo.Parcialmente}</span>
                      </div>
                      <div className="respuesta-tipo">
                        <span className="respuesta-color" style={{backgroundColor: COLORES_ESTADO.No}}></span>
                        <span>No: {datos.conteo.No}</span>
                      </div>
                      <div className="respuesta-tipo">
                        <span className="respuesta-color" style={{backgroundColor: COLORES_ESTADO.NA}}></span>
                        <span>No aplica: {datos.conteo.NA}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="categoria-barra-progreso">
                  <div 
                    className="barra-progreso" 
                    style={{ 
                      width: `${datos.porcentaje}%`, 
                      backgroundColor: obtenerColorPorcentaje(datos.porcentaje) 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Columna derecha: Áreas de riesgo y contingencias */}
        <div className="columna-riesgos">
          {resultados.areasRiesgo && resultados.areasRiesgo.length > 0 && (
            <div className="areas-riesgo-seccion">
              <h2>Áreas de Riesgo</h2>
              <div className="areas-riesgo-lista">
                {resultados.areasRiesgo.map((area, index) => (
                  <div key={index} className="area-riesgo-item">
                    <span className="icono-riesgo">⚠️</span>
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contingencias.length > 0 && (
            <div className="contingencias-seccion">
              <h2>Contingencias Identificadas</h2>
              <div className="alerta-contingencias">
                <p>
                  <strong>{contingencias.length} {contingencias.length === 1 ? 'área' : 'áreas'}</strong> con riesgos de
                  incumplimiento que requieren atención inmediata.
                </p>
              </div>

              <div className="contingencias-lista">
                {contingencias.map((contingencia, index) => (
                  <div key={index} className="contingencia-item">
                    <div className="contingencia-cabecera">
                      <h3>{contingencia.categoria}</h3>
                      <div className="contingencia-indicador">
                        <span className="contingencia-porcentaje">
                          {Math.round(contingencia.porcentaje)}%
                        </span>
                        <div className="contingencia-barra-contenedor">
                          <div 
                            className="contingencia-barra-progreso" 
                            style={{ 
                              width: `${contingencia.porcentaje}%`, 
                              backgroundColor: obtenerColorPorcentaje(contingencia.porcentaje)
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="contingencia-preguntas">
                      <h4>Preguntas con observaciones:</h4>
                      <ul>
                        {contingencia.preguntas.map((pregunta, i) => (
                          <li key={i} className="contingencia-pregunta">
                            <div className="pregunta-texto">{pregunta.texto}</div>
                            <div className="pregunta-respuesta">
                              Respuesta: <strong>{pregunta.respuesta}</strong>
                            </div>
                            {pregunta.comentario && (
                              <div className="pregunta-comentario">
                                <strong>Comentario:</strong> {pregunta.comentario}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

   

      {/* Botones de acción */}
      <div className="diagnostico-acciones">
        <button 
          className="btn-imprimir"
          onClick={() => window.print()}
        >
          Imprimir Resultados
        </button>
        <button 
          className="btn-nuevo-diagnostico"
          onClick={() => navigate("/")}
        >
          Nuevo Diagnóstico
        </button>
      </div>
    </div>
  );
};

export default Resultados;