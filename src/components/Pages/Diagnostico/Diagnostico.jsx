import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Diagnostico.css";

const Diagnostico = () => {
  const navigate = useNavigate();
  const [resultados, setResultados] = useState({
    porcentajeCumplimiento: 0,
    empleador: null,
    respuestas: [],
    categorias: {},
    loading: true,
    error: null,
    fecha: new Date().toLocaleDateString()
  });
  
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener el ID del empleador del localStorage
        const empleadorId = localStorage.getItem("empleadorId");
        
        if (!empleadorId) {
          setResultados(prev => ({
            ...prev,
            loading: false,
            error: "No se encontró información del empleador"
          }));
          return;
        }

        // 1. Obtener detalles del empleador
        const empleadorResponse = await axios.get(`http://localhost:3000/empleadores/${empleadorId}`);
        
        // 2. Obtener diagnóstico específico para este empleador
        const diagnosticoResponse = await axios.get(`http://localhost:3000/respuestas/diagnostico/${empleadorId}`);
        console.log("Diagnóstico Response:", diagnosticoResponse.data);
        
        
        // 3. Obtener respuestas del empleador
        const respuestasResponse = await axios.get(`http://localhost:3000/empleadores/${empleadorId}`);
        
        // 4. Obtener todas las preguntas para cruzar con las respuestas
        const preguntasResponse = await axios.get("http://localhost:3000/preguntas");
        
        // Analizar respuestas por categoría
        const respuestasData = respuestasResponse.data.length > 0 ? respuestasResponse.data[0].respuestas : [];
        const categorias = analizarRespuestasPorCategoria(
          preguntasResponse.data,
          respuestasData
        );

        
        setResultados({
          porcentajeCumplimiento: diagnosticoResponse.data.resultado || 0,
          empleador: empleadorResponse.data.exito ? empleadorResponse.data.empleador : null,
          respuestas: respuestasResponse.data,
          categorias,
          loading: false,
          error: null,
          fecha: new Date(respuestasResponse.data.length > 0 ? respuestasResponse.data[0].fecha : Date.now()).toLocaleDateString()
        });
      } catch (error) {
        console.error("Error al obtener resultados:", error);
        setResultados(prev => ({
          ...prev,
          loading: false,
          error: "Error al cargar los resultados. Por favor, intente nuevamente."
        }));
      }
    };

    obtenerDatos();
  }, []);

  // Función para analizar respuestas agrupadas por categoría
  const analizarRespuestasPorCategoria = (preguntas, respuestas) => {
    const categorias = {};

    // Inicializar contadores por categoría
    preguntas.forEach(pregunta => {
      if (!categorias[pregunta.categoria]) {
        categorias[pregunta.categoria] = {
          total: 0,
          cumplimiento: 0,
          preguntas: []
        };
      }
      categorias[pregunta.categoria].total += pregunta.peso;
    });
    respuestas.push({
      id: 1,
      fecha: new Date(),
      empleadorId: 1,
      respuestas: [
        { preguntaId: 1, respuesta: "Si" },
        { preguntaId: 2, respuesta: "No" },
        // Añade más respuestas según tus preguntas
      ]
    });

    // Calcular cumplimiento por categoría
    respuestas.forEach(respuesta => {
      const preguntaId = parseInt(respuesta.preguntaId || respuesta.id);
      const pregunta = preguntas.find(p => p.id === preguntaId);
      if (pregunta) {
        let valorRespuesta = 0;

        // Si la pregunta tiene un mapa de puntajes personalizado
        if (pregunta.respuestas && pregunta.respuestas[respuesta.respuesta] !== undefined) {
          valorRespuesta = Number(pregunta.respuestas[respuesta.respuesta]);
        } else {
          // Lógica predeterminada
          if (respuesta.respuesta === "Si" || respuesta.respuesta === "Sí") {
            valorRespuesta = pregunta.peso;
          } else if (respuesta.respuesta === "Si parcialmente" || respuesta.respuesta === "Sí parcialmente") {
            valorRespuesta = pregunta.peso / 2;
          }
        }

        categorias[pregunta.categoria].cumplimiento += valorRespuesta;
        categorias[pregunta.categoria].preguntas.push({
          id: pregunta.id,
          texto: pregunta.texto,
          respuesta: respuesta.respuesta,
          valorRespuesta,
          pesoTotal: pregunta.peso,
          cumplimiento: (valorRespuesta / pregunta.peso) * 100
        });
      }
    });

    // Calcular porcentajes finales por categoría
    Object.keys(categorias).forEach(categoria => {
      const { total, cumplimiento } = categorias[categoria];
      categorias[categoria].porcentaje = total > 0 ? (cumplimiento / total) * 100 : 0;
    });

    return categorias;
  };

  const obtenerColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 80) return "#4CAF50"; // Verde
    if (porcentaje >= 60) return "#FFC107"; // Amarillo
    if (porcentaje >= 40) return "#FF9800"; // Naranja
    return "#F44336"; // Rojo
  };

  const renderizarGraficoDona = (porcentaje, tamaño = 150) => {
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

  // Identificar áreas con contingencias (cumplimiento < 80%)
  const identificarContingencias = () => {
    const contingencias = [];
    Object.entries(resultados.categorias).forEach(([categoria, datos]) => {
      if (datos.porcentaje < 80) {
        // Filtrar preguntas con bajo cumplimiento
        const preguntasConContingencia = datos.preguntas
          .filter(p => p.cumplimiento < 80)
          .map(p => ({
            texto: p.texto,
            respuesta: p.respuesta,
            cumplimiento: p.cumplimiento
          }));

        contingencias.push({
          categoria,
          porcentaje: datos.porcentaje,
          preguntas: preguntasConContingencia
        });
      }
    });

    return contingencias;
    
  };

  if (resultados.loading) {
    return <div className="resultados-loading">Cargando resultados...</div>;
  }

  if (resultados.error) {
    return (
      <div className="resultados-error">
        <h2>Error</h2>
        <p>{resultados.error}</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  const contingencias = identificarContingencias();

  return (
    <div className="resultados-container">
      <div className="resultados-header">
        <h1>Resultados del Diagnóstico</h1>
        <div className="resultados-info">
          <p><strong>Empresa:</strong> {resultados.empleador?.nombre || "No disponible"}</p>
          <p>
            <strong>Identificación:</strong> {resultados.empleador?.tipoDocumento || ""}{" "}
            {resultados.empleador?.identificacion || "No disponible"}
          </p>
          <p><strong>Fecha del diagnóstico:</strong> {resultados.fecha}</p>
        </div>
      </div>

      <div className="resultados-cumplimiento">
        <h2>Cumplimiento Global</h2>
        <div className="grafico-dona-container">
          {renderizarGraficoDona(resultados.porcentajeCumplimiento, 200)}
          <div className="estado-cumplimiento">
            <span 
              className="estado-indicador"
              style={{ 
                backgroundColor: obtenerColorPorcentaje(resultados.porcentajeCumplimiento) 
              }}
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

      <div className="resultados-categorias">
        <h2>Cumplimiento por Categoría</h2>
        <div className="categorias-grid">
          {Object.entries(resultados.categorias).map(([categoria, datos]) => (
            <div key={categoria} className="categoria-card">
              <h3>{categoria}</h3>
              <div className="categoria-grafico">
                {renderizarGraficoDona(datos.porcentaje)}
              </div>
              <p className="categoria-detalle">
                {datos.porcentaje >= 80 
                  ? "Cumplimiento adecuado" 
                  : "Requiere atención"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {contingencias.length > 0 && (
        <div className="resultados-contingencias">
          <h2>Contingencias Identificadas</h2>
          <div className="alerta-contingencias">
            <p>
              Se han identificado {contingencias.length} áreas con posibles riesgos de
              incumplimiento que requieren atención inmediata.
            </p>
          </div>

          {contingencias.map((contingencia, index) => (
            <div key={index} className="contingencia-card">
              <h3>{contingencia.categoria}</h3>
              <div className="contingencia-header">
                <div className="contingencia-porcentaje">
                  {Math.round(contingencia.porcentaje)}% de cumplimiento
                </div>
                <div 
                  className="contingencia-barra" 
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#f0f0f0',
                    height: '8px',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{ 
                      width: `${contingencia.porcentaje}%`, 
                      backgroundColor: obtenerColorPorcentaje(contingencia.porcentaje),
                      height: '100%'
                    }}
                  ></div>
                </div>
              </div>
              
              <h4>Preguntas con observaciones:</h4>
              <ul className="contingencia-preguntas">
                {contingencia.preguntas.map((pregunta, i) => (
                  <li key={i}>
                    <p className="pregunta-texto">{pregunta.texto}</p>
                    <p className="pregunta-respuesta">
                      <strong>Respuesta:</strong> {pregunta.respuesta}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="resultados-acciones">
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

export default Diagnostico;