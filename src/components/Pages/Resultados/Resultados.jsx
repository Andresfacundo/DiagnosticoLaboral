import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import "./Resultados.css";
const API_URL = import.meta.env.VITE_API_URL

const Resultados = () => {
  const navigate = useNavigate();
  const [resultados, setResultados] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [respuestasPorCategoria, setRespuestasPorCategoria] = useState({});
  const [puntajePorCategoria, setPuntajePorCategoria] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [empleadorInfo, setEmpleadorInfo] = useState({
    nombre: "",
    tipo: "",
    identificacion: ""
  });

  // Colores para los gráficoS
  const COLORES = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
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
          setError("No se encontró información del empleador. Por favor regrese al inicio.");
          setCargando(false);
          return;
        }

        // Obtener empleador desde el backend
        const empleadorResponse = await axios.get(`${API_URL}/empleadores/${empleadorId}`);
        setEmpleadorInfo(empleadorResponse.data);

        // Obtener respuestas desde el localStorage o el servidor
        let respuestas = JSON.parse(localStorage.getItem("respuestas"));
        if (!respuestas) {
          const respuestasResponse = await axios.get(`${API_URL}/respuestas?empleadorId=${empleadorId}`);
          respuestas = respuestasResponse.data;
        }

        // Obtener preguntas para asociarlas con las respuestas
        const preguntasResponse = await axios.get(`${API_URL}/preguntas`);
        const preguntas = preguntasResponse.data;

        // Procesar datos para los gráficos
        procesarDatos(respuestas, preguntas);
        
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los resultados. Por favor intente nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  // Función para procesar los datos para los gráficos
  const procesarDatos = (respuestas, preguntas) => {
    // Asociar cada respuesta con su pregunta correspondiente
    const respuestasConDetalles = respuestas.map(respuesta => {
      const pregunta = preguntas.find(p => p.id === respuesta.id);
      return { ...respuesta, pregunta };
    });

    // Obtener categorías únicas
    const categoriasUnicas = [...new Set(preguntas.map(p => p.categoria))];
    setCategorias(categoriasUnicas);

    // Agrupar respuestas por categoría
    const respuestasPorCat = {};
    const puntajePorCat = [];

    categoriasUnicas.forEach(categoria => {
      // Filtrar respuestas por categoría
      const respuestasCat = respuestasConDetalles.filter(r => r.pregunta && r.pregunta.categoria === categoria);
      
      // Contar tipos de respuestas (Sí, No, N/A)
      const conteo = {
        Si: 0,
        No: 0,
        NA: 0
      };

      let puntajeTotal = 0;
      let puntajeObtenido = 0;
      let puntajePosible = 0;

      respuestasCat.forEach(r => {
        // Contar respuestas
        if (r.respuesta === "Sí") {
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
      });

      // Calcular porcentaje de cumplimiento
      const porcentajeCumplimiento = puntajePosible > 0 
        ? Math.round((puntajeObtenido / puntajePosible) * 100) 
        : 0;

      // Guardar conteo para gráfico de barras
      respuestasPorCat[categoria] = [
        { name: "Sí", value: conteo.Si },
        { name: "No", value: conteo.No },
        { name: "N/A", value: conteo.NA }
      ];

      // Guardar puntaje para gráfico de torta
      puntajePorCat.push({
        name: categoria,
        value: porcentajeCumplimiento,
        puntajeObtenido,
        puntajePosible,
        // Identificar áreas de mayor riesgo (menos del 70% de cumplimiento)
        riesgo: porcentajeCumplimiento < 70
      });
    });

    setRespuestasPorCategoria(respuestasPorCat);
    setPuntajePorCategoria(puntajePorCat);

    // Calcular resultados generales
    const totalPreguntas = respuestas.length;
    const cumplimiento = respuestas.filter(r => r.respuesta === "Sí").length;
    const incumplimiento = respuestas.filter(r => r.respuesta === "No").length;
    const noAplica = respuestas.filter(r => r.respuesta === "N/A").length;

    // Calcular puntaje general
    let puntajeTotal = 0;
    let puntajeMaximo = 0;

    respuestasConDetalles.forEach(r => {
      if (r.pregunta) {
        if (r.respuesta === "Sí") {
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
    const areasRiesgo = puntajePorCat
      .filter(cat => cat.riesgo)
      .map(cat => cat.name);

    setResultados({
      totalPreguntas,
      cumplimiento,
      incumplimiento,
      noAplica,
      puntajeTotal,
      puntajeMaximo,
      porcentajeGeneral,
      areasRiesgo,
      respuestasDetalladas: respuestasConDetalles
    });
  };

  const generarInforme = () => {
    // Implementar lógica para generar un PDF o enviar a otra página
    // Por ahora, simplemente guardaremos los resultados en localStorage
    localStorage.setItem("diagnosticoResultados", JSON.stringify(resultados));
    alert("Informe generado correctamente");
  };

  if (cargando) {
    return (
      <div className="resultados-container">
        <h2>Cargando resultados...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resultados-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="resultados-container">
      <h2>Diagnóstico de Cumplimiento</h2>
      
      <div className="empleador-info">
        <h3>Información del Empleador</h3>
        <p><strong>Nombre:</strong> {empleadorInfo.nombre}</p>
        <p><strong>Tipo:</strong> {empleadorInfo.tipo}</p>
        <p><strong>Identificación:</strong> {empleadorInfo.identificacion}</p>
      </div>

      {resultados && (
        <>
          <div className="resultados-generales">
            <h3>Resultados Generales</h3>
            <div className="estadisticas">
              <div className="estadistica">
                <span className="numero">{resultados.totalPreguntas}</span>
                <span className="etiqueta">Total de preguntas</span>
              </div>
              <div className="estadistica">
                <span className="numero">{resultados.porcentajeGeneral.toFixed(1)}%</span>
                <span className="etiqueta">Cumplimiento general</span>
              </div>
              <div className="estadistica">
                <span className="numero">{resultados.areasRiesgo.length}</span>
                <span className="etiqueta">Áreas de riesgo</span>
              </div>
            </div>
          </div>

          <div className="grafico-general">
            <h3>Cumplimiento General</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Cumplimiento", value: resultados.cumplimiento },
                    { name: "Incumplimiento", value: resultados.incumplimiento },
                    { name: "No Aplica", value: resultados.noAplica }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill={COLORES_ESTADO.Si} />
                  <Cell fill={COLORES_ESTADO.No} />
                  <Cell fill={COLORES_ESTADO.NA} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="areas-riesgo">
            <h3>Áreas de Riesgo</h3>
            {resultados.areasRiesgo.length > 0 ? (
              <ul>
                {resultados.areasRiesgo.map((area, index) => (
                  <li key={index} className="area-riesgo">
                    <span className="icono-riesgo">⚠️</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No se detectaron áreas de alto riesgo.</p>
            )}
          </div>

          <h3>Resultados por Categoría</h3>
          <div className="graficos-categorias">
            {categorias.map((categoria, index) => (
              <div key={categoria} className="categoria-card">
                <h4>{categoria}</h4>
                
                {/* Gráfico de porcentaje de cumplimiento */}
                <div className="cumplimiento-porcentaje">
                  <div 
                    className="barra-progreso" 
                    style={{ 
                      width: `${puntajePorCategoria.find(c => c.name === categoria)?.value || 0}%`,
                      backgroundColor: puntajePorCategoria.find(c => c.name === categoria)?.value < 70 ? '#F44336' : '#4CAF50'
                    }}
                  >
                    <span>{puntajePorCategoria.find(c => c.name === categoria)?.value || 0}%</span>
                  </div>
                </div>
                
                {/* Gráfico de distribución de respuestas */}
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={respuestasPorCategoria[categoria]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      {respuestasPorCategoria[categoria].map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === "Sí" ? COLORES_ESTADO.Si : 
                                entry.name === "No" ? COLORES_ESTADO.No : 
                                COLORES_ESTADO.NA} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          <div className="acciones">
            <button onClick={generarInforme} className="btn-generar-informe">
              Generar Informe Completo
            </button>
            <button onClick={() => navigate("/")} className="btn-volver">
              Volver al Inicio
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Resultados;