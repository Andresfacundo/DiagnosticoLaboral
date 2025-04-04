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
  console.log(resultados);
  
  
  // Colores para los gráficos (tomados del componente Resultados)
  const COLORES_ESTADO = {
    Si: "#4CAF50", // Verde para cumplimiento
    No: "#F44336", // Rojo para incumplimiento
    NA: "#9E9E9E" // Gris para no aplicable
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener información del empleador del localStorage
        const empleadorId = localStorage.getItem("empleadorId");
        const empleadorNombre = localStorage.getItem("empleadorNombre");
        
        if (!empleadorId) {
          setResultados(prev => ({
            ...prev,
            loading: false,
            error: "No se encontró información del empleador. Por favor regrese al inicio."
          }));
          return;
        }

        // Obtener empleador desde el backend (igual que en Resultados)
        const empleadorResponse = await axios.get(`http://localhost:3000/empleadores/${empleadorId}`);
        const empleadorInfo = empleadorResponse.data;

        // Obtener respuestas desde el localStorage o el servidor (como en Resultados)
        let respuestas = JSON.parse(localStorage.getItem("respuestas"));
        if (!respuestas) {
          const respuestasResponse = await axios.get(`http://localhost:3000/respuestas?empleadorId=${empleadorId}`);
          respuestas = respuestasResponse.data;
        }

        // Obtener preguntas para asociarlas con las respuestas (como en Resultados)
        const preguntasResponse = await axios.get("http://localhost:3000/preguntas");
        const preguntas = preguntasResponse.data;

        // Procesar datos usando la lógica del componente Resultados
        const datosAnalizados = procesarDatos(respuestas, preguntas);
        
        setResultados({
          porcentajeCumplimiento: datosAnalizados.porcentajeGeneral,
          empleador: empleadorInfo,
          respuestas: respuestas,
          categorias: datosAnalizados.categoriasAnalizadas,
          loading: false,
          error: null,
          fecha: new Date().toLocaleDateString(),
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

  // Función para procesar los datos adaptada del componente Resultados
  const procesarDatos = (respuestas, preguntas) => {
    // Asociar cada respuesta con su pregunta correspondiente
    const respuestasConDetalles = respuestas.map(respuesta => {
      const pregunta = preguntas.find(p => p.id === respuesta.id);
      return { ...respuesta, pregunta };
    });

    // Obtener categorías únicas
    const categoriasUnicas = [...new Set(preguntas.map(p => p.categoria))];
    
    // Procesar datos por categoría (usando la lógica de Resultados)
    const categoriasAnalizadas = {};
    const puntajePorCategoria = [];

    categoriasUnicas.forEach(categoria => {
      // Filtrar respuestas por categoría
      const respuestasCat = respuestasConDetalles.filter(r => r.pregunta && r.pregunta.categoria === categoria);
      
      // Contar tipos de respuestas (Sí, No, N/A)
      const conteo = {
        Si: 0,
        No: 0,
        NA: 0
      };

      let puntajeObtenido = 0;
      let puntajePosible = 0;
      const preguntasCategoria = [];

      respuestasCat.forEach(r => {
        // Contar respuestas
        if (r.respuesta === "Sí" || r.respuesta === "Si") {
          conteo.Si++;
          // Calcular puntaje según el valor asignado a "Sí" para esa pregunta
          puntajeObtenido += r.pregunta.respuestas?.Si || r.pregunta.peso;
        } else if (r.respuesta === "No") {
          conteo.No++;
          // Para "No" generalmente es 0, pero usamos el valor configurado si existe
          puntajeObtenido += r.pregunta.respuestas?.No || 0;
        } else if (r.respuesta === "N/A") {
          conteo.NA++;
          // Para "N/A" generalmente es 0, pero usamos el valor configurado si existe
          puntajeObtenido += r.pregunta.respuestas?.["N/A"] || 0;
        }

        // Acumular el puntaje máximo posible (valor de "Sí")
        puntajePosible += r.pregunta.respuestas?.Si || r.pregunta.peso;
        
        // Agregar pregunta analizada
        preguntasCategoria.push({
          id: r.pregunta.id,
          texto: r.pregunta.texto,
          respuesta: r.respuesta,
          valorRespuesta: r.respuesta === "Sí" || r.respuesta === "Si" 
            ? (r.pregunta.respuestas?.Si || r.pregunta.peso) 
            : (r.pregunta.respuestas?.[r.respuesta] || 0),
          pesoTotal: r.pregunta.respuestas?.Si || r.pregunta.peso,
          cumplimiento: r.respuesta === "Sí" || r.respuesta === "Si" ? 100 : 0
        });
      });

      // Calcular porcentaje de cumplimiento
      const porcentajeCumplimiento = puntajePosible > 0 
        ? (puntajeObtenido / puntajePosible) * 100 
        : 0;

      // Guardar información por categoría
      categoriasAnalizadas[categoria] = {
        total: puntajePosible,
        cumplimiento: puntajeObtenido,
        porcentaje: porcentajeCumplimiento,
        preguntas: preguntasCategoria,
        conteo: conteo
      };

      // Guardar puntaje para identificar áreas de riesgo
      puntajePorCategoria.push({
        name: categoria,
        value: porcentajeCumplimiento,
        puntajeObtenido,
        puntajePosible,
        // Identificar áreas de mayor riesgo (menos del 70% de cumplimiento)
        riesgo: porcentajeCumplimiento < 70
      });
    });

    // Calcular resultados generales
    const totalPreguntas = respuestas.length;
    const cumplimiento = respuestas.filter(r => r.respuesta === "Sí" || r.respuesta === "Si").length;
    const incumplimiento = respuestas.filter(r => r.respuesta === "No").length;
    const noAplica = respuestas.filter(r => r.respuesta === "N/A").length;

    // Calcular puntaje general
    let puntajeTotal = 0;
    let puntajeMaximo = 0;

    respuestasConDetalles.forEach(r => {
      if (r.pregunta) {
        if (r.respuesta === "Sí" || r.respuesta === "Si") {
          puntajeTotal += r.pregunta.respuestas?.Si || r.pregunta.peso;
        } else if (r.respuesta === "No") {
          puntajeTotal += r.pregunta.respuestas?.No || 0;
        } else if (r.respuesta === "N/A") {
          puntajeTotal += r.pregunta.respuestas?.["N/A"] || 0;
        }
        
        // El puntaje máximo siempre es el valor de "Sí"
        puntajeMaximo += r.pregunta.respuestas?.Si || r.pregunta.peso;
      }
    });

    const porcentajeGeneral = puntajeMaximo > 0 
      ? (puntajeTotal / puntajeMaximo) * 100 
      : 0;

    // Áreas de mayor riesgo (categorías con menos del 70% de cumplimiento)
    const areasRiesgo = puntajePorCategoria
      .filter(cat => cat.riesgo)
      .map(cat => cat.name);

    return {
      totalPreguntas,
      cumplimiento,
      incumplimiento,
      noAplica,
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

  // Identificar áreas con contingencias (ahora usando la misma lógica de Resultados)
  const identificarContingencias = () => {
    if (!resultados.areasRiesgo) return [];
    
    const contingencias = [];
    resultados.areasRiesgo.forEach(categoria => {
      if (resultados.categorias[categoria]) {
        // Filtrar preguntas con bajo cumplimiento
        const preguntasConContingencia = resultados.categorias[categoria].preguntas
          .filter(p => p.cumplimiento < 70)
          .map(p => ({
            texto: p.texto,
            respuesta: p.respuesta,
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

  // const generarInforme = () => {
  //   // Implementar lógica para generar un PDF o enviar a otra página (de Resultados)
  //   localStorage.setItem("diagnosticoResultados", JSON.stringify(resultados));
  //   alert("Informe generado correctamente");
  // };

  if (resultados.loading) {
    return (
      <div className="resultados-loading">
        <h2>Cargando resultados...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
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
          <p><strong>Empresa:</strong> {resultados.empleador?.empleador?.nombre || "No disponible"}</p>
          <p>
            <strong>Identificación:</strong> {resultados.empleador?.tipo || ""}{" "}
            {resultados.empleador?.empleador?.identificacion || "No disponible"}
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

      {/* Áreas de Riesgo (tomado del componente Resultados) */}
      {resultados.areasRiesgo && resultados.areasRiesgo.length > 0 && (
        <div className="areas-riesgo">
          <h3>Áreas de Riesgo</h3>
          <ul>
            {resultados.areasRiesgo.map((area, index) => (
              <li key={index} className="area-riesgo">
                <span className="icono-riesgo">⚠️</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="resultados-categorias">
        <h2>Cumplimiento por Categoría</h2>
        <div className="categorias-grid">
          {Object.entries(resultados.categorias).map(([categoria, datos]) => (
            <div key={categoria} className="categoria-card">
              <h3>{categoria}</h3>
              <div className="categoria-grafico">
                {renderizarGraficoDona(datos.porcentaje)}
              </div>
              <div className="categoria-stats">
                <p className="categoria-detalle">
                  {datos.porcentaje >= 80 
                    ? "Cumplimiento adecuado" 
                    : datos.porcentaje >= 60
                    ? "Requiere mejoras"
                    : "Alto riesgo"}
                </p>
                {/* Distribución de respuestas (del componente Resultados) */}
                <div className="respuestas-distribucion">
                  <div className="respuesta-tipo">
                    <span className="respuesta-color" style={{backgroundColor: COLORES_ESTADO.Si}}></span>
                    <span>Sí: {datos.conteo.Si}</span>
                  </div>
                  <div className="respuesta-tipo">
                    <span className="respuesta-color" style={{backgroundColor: COLORES_ESTADO.No}}></span>
                    <span>No: {datos.conteo.No}</span>
                  </div>
                  <div className="respuesta-tipo">
                    <span className="respuesta-color" style={{backgroundColor: COLORES_ESTADO.NA}}></span>
                    <span>N/A: {datos.conteo.NA}</span>
                  </div>
                </div>
              </div>
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
        {/* <button 
          className="btn-generar-informe"
          onClick={generarInforme}
        >
          Generar Informe Completo
        </button> */}
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