// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Diagnostico = () => {
//     const navigate = useNavigate();
//     const [resultados, setResultados] = useState(null);

//     useEffect(() => {
//         // Obtener respuestas guardadas en LocalStorage
//         const respuestasGuardadas = JSON.parse(localStorage.getItem("respuestas"));

//         if (!respuestasGuardadas) {
//             alert("No hay respuestas guardadas. Redirigiendo...");
//             navigate("/preguntas");
//             return;
//         }

//         // Simular cálculo de diagnóstico (ejemplo: % de cumplimiento)
//         let totalPreguntas = respuestasGuardadas.length;
//         let respuestasSi = respuestasGuardadas.filter(r => r.respuesta === "Sí").length;
//         let porcentajeCumplimiento = Math.round((respuestasSi / totalPreguntas) * 100);

//         // Clasificación según porcentaje
//         let estado = "";
//         if (porcentajeCumplimiento >= 80) {
//             estado = "Excelente ✅";
//         } else if (porcentajeCumplimiento >= 50) {
//             estado = "Aceptable ⚠️";
//         } else {
//             estado = "Crítico ❌";
//         }

//         // Guardar resultado
//         setResultados({
//             porcentaje: porcentajeCumplimiento,
//             estado,
//             respuestas: respuestasGuardadas
//         });
//     }, [navigate]);

//     return (
//         <div>
//             <h2>Resultados del Diagnóstico</h2>

//             {resultados ? (
//                 <div>
//                     <h3>📊 Cumplimiento: {resultados.porcentaje}%</h3>
//                     <h4>Estado: {resultados.estado}</h4>

//                     <h3>📋 Respuestas Detalladas:</h3>
//                     <ul>
//                         {resultados.respuestas.map((r) => (
//                             <li key={r.id}>
//                                 <strong>{r.respuesta === "Sí" ? "✅" : r.respuesta === "No" ? "❌" : "⚪"} {r.respuesta}</strong> - {r.comentario ? `"${r.comentario}"` : "Sin comentario"}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             ) : (
//                 <p>Cargando resultados...</p>
//             )}

//             <button onClick={() => navigate("/")}>Volver al inicio</button>
//         </div>
//     );
// };

// export default Diagnostico;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   PieChart, Pie, Cell, ResponsiveContainer 
// } from 'recharts';
// import './Diagnostico.css'

// const ResultadosDashboard = () => {
//   const [resultados, setResultados] = useState([]);
//   const [contingencias, setContingencias] = useState({});
//   const [filtros, setFiltros] = useState({
//     categoria: '',
//     rangoFecha: null
//   });

//   // Colores para gráficos
//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

//   // Obtener resultados desde el backend
//   useEffect(() => {
//     const fetchResultados = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/resultados', { 
//           params: filtros 
//         });
        
//         setResultados(response.data.resultados);
//         procesarContingencias(response.data.resultados);
//       } catch (error) {
//         console.error('Error al obtener resultados', error);
//       }
//     };

//     fetchResultados();
//   }, [filtros]);

//   // Procesar contingencias
//   const procesarContingencias = (data) => {
//     const contingenciasAgrupadas = {};

//     data.forEach(resultado => {
//       // Ejemplo de agrupación por categoría
//       const categoria = resultado.categoria || 'Sin Categoría';
      
//       if (!contingenciasAgrupadas[categoria]) {
//         contingenciasAgrupadas[categoria] = {
//           total: 0,
//           positivos: 0,
//           negativos: 0,
//           riesgos: []
//         };
//       }

//       contingenciasAgrupadas[categoria].total++;
      
//       if (resultado.esPositivo) {
//         contingenciasAgrupadas[categoria].positivos++;
//       } else {
//         contingenciasAgrupadas[categoria].negativos++;
//       }

//       // Identificar riesgos potenciales
//       if (resultado.nivelRiesgo > 5) {
//         contingenciasAgrupadas[categoria].riesgos.push(resultado);
//       }
//     });

//     setContingencias(contingenciasAgrupadas);
//   };

//   // Preparar datos para gráficos
//   const prepararDatosBarras = () => {
//     return Object.entries(contingencias).map(([categoria, datos]) => ({
//       categoria,
//       total: datos.total,
//       positivos: datos.positivos,
//       negativos: datos.negativos
//     }));
//   };

//   const prepararDatosPastel = () => {
//     return Object.entries(contingencias).map(([categoria, datos]) => ({
//       name: categoria,
//       value: datos.total
//     }));
//   };

//   return (
//     <div className="resultados-dashboard">
//       <header className="dashboard-header">
//         <h1>Panel de Resultados y Contingencias</h1>
        
//         <div className="filtros-container">
//           <select 
//             onChange={(e) => setFiltros(prev => ({
//               ...prev, 
//               categoria: e.target.value
//             }))}
//           >
//             <option value="">Todas las Categorías</option>
//             {Object.keys(contingencias).map(categoria => (
//               <option key={categoria} value={categoria}>
//                 {categoria}
//               </option>
//             ))}
//           </select>
          
//           <input 
//             type="date" 
//             onChange={(e) => setFiltros(prev => ({
//               ...prev, 
//               rangoFecha: e.target.value
//             }))}
//           />
//         </div>
//       </header>

//       <section className="graficos-container">
//         <div className="grafico-barras">
//           <h2>Distribución de Resultados por Categoría</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={prepararDatosBarras()}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="categoria" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="positivos" stackId="a" fill="#4CAF50" />
//               <Bar dataKey="negativos" stackId="a" fill="#F44336" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="grafico-pastel">
//           <h2>Distribución Total por Categoría</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={prepararDatosPastel()}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {prepararDatosPastel().map((entry, index) => (
//                   <Cell 
//                     key={`cell-${index}`} 
//                     fill={COLORS[index % COLORS.length]} 
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       <section className="contingencias-detalladas">
//         <h2>Análisis de Contingencias</h2>
//         {Object.entries(contingencias).map(([categoria, datos]) => (
//           <div key={categoria} className="contingencia-categoria">
//             <h3>{categoria}</h3>
//             <div className="contingencia-stats">
//               <p>Total de Resultados: {datos.total}</p>
//               <p>Resultados Positivos: {datos.positivos}</p>
//               <p>Resultados Negativos: {datos.negativos}</p>
//             </div>
//             {datos.riesgos.length > 0 && (
//               <div className="riesgos-detalle">
//                 <h4>Riesgos Identificados</h4>
//                 <ul>
//                   {datos.riesgos.map((riesgo, index) => (
//                     <li key={index}>
//                       Nivel de Riesgo: {riesgo.nivelRiesgo} 
//                       - Descripción: {riesgo.descripcion}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// };

// export default ResultadosDashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   PieChart, Pie, Cell, ResponsiveContainer 
// } from 'recharts';
// import './Diagnostico.css';

// const ResultadosDashboard = () => {
//   const [preguntas, setPreguntas] = useState([]);
//   const [respuestas, setRespuestas] = useState([]);
//   const [diagnostico, setDiagnostico] = useState(null);

//   // Fetch preguntas when component mounts
//   useEffect(() => {
//     const fetchPreguntas = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/preguntas');
//         setPreguntas(response.data);
//       } catch (error) {
//         console.error('Error al obtener preguntas', error);
//       }
//     };

//     fetchPreguntas();
//   }, []);

//   // Fetch respuestas
//   useEffect(() => {
//     const fetchRespuestas = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/respuestas');
//         setRespuestas(response.data);
//       } catch (error) {
//         console.error('Error al obtener respuestas', error);
//       }
//     };

//     fetchRespuestas();
//   }, []);

//   // Fetch diagnóstico
//   useEffect(() => {
//     const fetchDiagnostico = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/diagnostico');
//         setDiagnostico(response.data);
//       } catch (error) {
//         console.error('Error al obtener diagnóstico', error);
//       }
//     };

//     fetchDiagnostico();
//   }, []);

//   // Preparar datos para gráfico de barras de preguntas
//   const prepararDatosBarras = () => {
//     return preguntas.map(pregunta => ({
//       pregunta: pregunta.texto,
//       peso: pregunta.peso
//     }));
//   };

//   // Preparar datos para gráfico de pastel de respuestas
//   const prepararDatosPastel = () => {
//     const respuestasPorTipo = {
//       Si: 0,
//       No: 0,
//       Parcial: 0
//     };

//     respuestas.forEach(respuestaSet => {
//       respuestaSet.forEach(respuesta => {
//         if (respuesta.respuesta === 'Si') {
//           respuestasPorTipo.Si++;
//         } else if (respuesta.respuesta === 'No') {
//           respuestasPorTipo.No++;
//         } else {
//           respuestasPorTipo.Parcial++;
//         }
//       });
//     });

//     return Object.entries(respuestasPorTipo).map(([name, value]) => ({ name, value }));
//   };

//   // Colores para gráficos
//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

//   return (
//     <div className="resultados-dashboard">
//       <header className="dashboard-header">
//         <h1>Panel de Diagnóstico</h1>
        
//         {diagnostico && (
//           <div className="diagnostico-resumen">
//             <h2>Resultado del Diagnóstico</h2>
//             <p>Porcentaje de Cumplimiento: {diagnostico.resultado}%</p>
            
//             {/* Clasificación según porcentaje */}
//             <h3>
//               {diagnostico.resultado >= 80 
//                 ? "Estado: Excelente ✅" 
//                 : diagnostico.resultado >= 50 
//                 ? "Estado: Aceptable ⚠️" 
//                 : "Estado: Crítico ❌"}
//             </h3>
//           </div>
//         )}
//       </header>

//       <section className="graficos-container">
//         <div className="grafico-barras">
//           <h2>Peso de Preguntas</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={prepararDatosBarras()}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="pregunta" />
//               <YAxis label={{ value: 'Peso', angle: -90, position: 'insideLeft' }} />
//               <Tooltip />
//               <Bar dataKey="peso" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="grafico-pastel">
//           <h2>Distribución de Respuestas</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={prepararDatosPastel()}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {prepararDatosPastel().map((entry, index) => (
//                   <Cell 
//                     key={`cell-${index}`} 
//                     fill={COLORS[index % COLORS.length]} 
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       <section className="respuestas-detalladas">
//         <h2>Detalle de Respuestas</h2>
//         {respuestas.map((respuestaSet, setIndex) => (
//           <div key={setIndex} className="conjunto-respuestas">
//             <h3>Conjunto de Respuestas {setIndex + 1}</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Pregunta</th>
//                   <th>Respuesta</th>
//                   <th>Comentario</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {respuestaSet.map((respuesta, index) => {
//                   const pregunta = preguntas.find(p => p.id === Number(respuesta.preguntaId));
//                   return (
//                     <tr key={index}>
//                       <td>{pregunta ? pregunta.texto : 'Pregunta no encontrada'}</td>
//                       <td>{respuesta.respuesta}</td>
//                       <td>{respuesta.comentario || 'Sin comentario'}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// };

// export default ResultadosDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import './Diagnostico.css';

const ResultadosDashboard = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [diagnostico, setDiagnostico] = useState(null);

  // Fetch preguntas when component mounts
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/preguntas');
        setPreguntas(response.data);
      } catch (error) {
        console.error('Error al obtener preguntas', error);
      }
    };

    fetchPreguntas();
  }, []);

  // Fetch respuestas
  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/respuestas');
        setRespuestas(response.data.flat()); // Flatten the array of arrays
      } catch (error) {
        console.error('Error al obtener respuestas', error);
      }
    };

    fetchRespuestas();
  }, []);

  // Fetch diagnóstico
  useEffect(() => {
    const fetchDiagnostico = async () => {
      try {
        const response = await axios.get('http://localhost:3000/diagnostico');
        setDiagnostico(response.data);
      } catch (error) {
        console.error('Error al obtener diagnóstico', error);
      }
    };

    fetchDiagnostico();
  }, []);

  // Preparar datos para gráfico de barras de preguntas
  const prepararDatosBarras = () => {
    return preguntas.map(pregunta => ({
      pregunta: pregunta.texto,
      peso: pregunta.peso
    }));
  };

  // Preparar datos para gráfico de pastel de respuestas
  const prepararDatosPastel = () => {
    const respuestasPorTipo = {
      'Sí': 0,
      'No': 0,
      'Otro': 0
    };

    // Contar respuestas
    respuestas.forEach(respuesta => {
      switch(respuesta.respuesta) {
        case 'Sí':
          respuestasPorTipo['Sí']++;
          break;
        case 'No':
          respuestasPorTipo['No']++;
          break;
        default:
          respuestasPorTipo['Otro']++;
      }
    });

    // Convertir a formato recharts
    return Object.entries(respuestasPorTipo)
      .filter(([_, value]) => value > 0) // Solo incluir tipos con valores > 0
      .map(([name, value]) => ({ name, value }));
  };

  // Colores para gráficos
  const COLORS = ['#4CAF50', '#F44336', '#FFC107'];

  return (
    <div className="resultados-dashboard">
      <header className="dashboard-header">
        <h1>Panel de Diagnóstico</h1>
        
        {diagnostico && (
          <div className="diagnostico-resumen">
            <h2>Resultado del Diagnóstico</h2>
            <p>Porcentaje de Cumplimiento: {diagnostico.resultado}%</p>
            
            {/* Clasificación según porcentaje */}
            <h3>
              {diagnostico.resultado >= 80 
                ? "Estado: Excelente ✅" 
                : diagnostico.resultado >= 50 
                ? "Estado: Aceptable ⚠️" 
                : "Estado: Crítico ❌"}
            </h3>
          </div>
        )}
      </header>

      <section className="graficos-container">
        <div className="grafico-barras">
          <h2>Peso de Preguntas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepararDatosBarras()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pregunta" />
              <YAxis label={{ value: 'Peso', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="peso" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico-pastel">
          <h2>Distribución de Respuestas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepararDatosPastel()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {prepararDatosPastel().map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

    </div>
  );
};

export default ResultadosDashboard;