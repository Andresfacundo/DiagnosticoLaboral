import './App.css'
import { Routes,Route } from 'react-router-dom'
import Resultados from './components/Pages/Resultados/Resultados.jsx'
import Preguntas from './components/Pages/Preguntas/Preguntas.jsx'
import Formulario from './components/Pages/Formulario/Formulario.jsx'
import Home from './components/Pages/Home/Home.jsx'
import Cuestionario from './components/Pages/Cuestionario/Cuestionario.jsx'
import Navbar from './components/Ui/Navbar/Navbar.jsx'
import Login from './components/Ui/Login/Login.jsx'
import Footer from './components/Layouts/Footer/Footer.jsx'
import InfoDiagnostico from './components/Ui/InfoDiagnostico/InfoDiagnostico.jsx'
import AboutDiagnosis from './components/Ui/AboutDiagnosis/AboutDiagnosis.jsx'
import Registros from './components/Ui/Registros/Registros.jsx'

function App() {

  return (
    <>
    {/* <Logo/> */}
    <Navbar id='navbar'/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='questions' element={<Preguntas/>}/>
      <Route path='diagnostico/form' element={<Formulario />}/>
      <Route path='resultados' element={<Resultados/>}/>
      <Route path='cuestionario' element={<Cuestionario/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='diagnostico' element={<InfoDiagnostico/>}/>
      <Route path='nosotros' element={<AboutDiagnosis/>}/>
      <Route path='registros' element={<Registros/>}/>
    </Routes>
    <Footer/>        
    </>
  )
}

export default App

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import RadarChartComponent from '../../Ui/RadarChart/RadarChartComponent';
// import GAP from '../../../../public/gap.png';
// import "./Registros.css";

// const API_URL = import.meta.env.VITE_API_URL;

// const Registros = () => {
//   const navigate = useNavigate();
  
//   // Estados para la consulta
//   const [busqueda, setBusqueda] = useState("");
//   const [tipoBusqueda, setTipoBusqueda] = useState("identificacion"); // identificacion, nombre, fecha
//   const [empleadores, setEmpleadores] = useState([]);
//   const [resultadosHistoricos, setResultadosHistoricos] = useState([]);
//   const [empleadorSeleccionado, setEmpleadorSeleccionado] = useState(null);
//   const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState(null);
//   const [cargando, setCargando] = useState(false);
//   const [error, setError] = useState(null);
//   const [mostrarDetalles, setMostrarDetalles] = useState(false);

//   // Efecto para cargar la lista de empleadores cuando se monta el componente
//   useEffect(() => {
//     const cargarEmpleadores = async () => {
//       try {
//         setCargando(true);
//         const response = await axios.get(`${API_URL}/api/empleadores`);
//         setEmpleadores(response.data);
//         setCargando(false);
//       } catch (err) {
//         console.error("Error al cargar empleadores:", err);
//         setError("Error al cargar la lista de empleadores.");
//         setCargando(false);
//       }
//     };

//     cargarEmpleadores();
//   }, []);

//   // Función para buscar empleadores
//   const buscarEmpleadores = () => {
//     if (!busqueda) return;
    
//     const empleadoresFiltrados = empleadores.filter(emp => {
//       switch (tipoBusqueda) {
//         case "identificacion":
//           return emp.identificacion.toLowerCase().includes(busqueda.toLowerCase());
//         case "nombre":
//           return emp.nombres.toLowerCase().includes(busqueda.toLowerCase());
//         default:
//           return false;
//       }
//     });

//     return empleadoresFiltrados;
//   };

//   // Función para seleccionar un empleador y cargar sus diagnósticos
// // Función modificada para seleccionar un empleador y cargar sus diagnósticos
// const seleccionarEmpleador = async (empleador) => {
//     setEmpleadorSeleccionado(empleador);
//     setDiagnosticoSeleccionado(null);
//     setMostrarDetalles(false);
    
//     try {
//       setCargando(true);
//       console.log(`Consultando diagnósticos para el empleador ID: ${empleador.id}`);
//       const endpoint = `${API_URL}/api/diagnosticos/empleador/${empleador.id}`;
//       console.log(`Endpoint: ${endpoint}`);
      
//       const response = await axios.get(endpoint);
//       console.log("Respuesta de la API:", response.data);
      
//       setResultadosHistoricos(response.data);
//       if (response.data.length === 0) {
//         console.log("No se encontraron diagnósticos para este empleador");
//       }
//       setCargando(false);
//     } catch (err) {
//       console.error("Error al cargar diagnósticos:", err);
//       // Mostrar más detalles del error
//       if (err.response) {
//         console.error("Respuesta del servidor:", err.response.data);
//         console.error("Status code:", err.response.status);
//         setError(`Error al cargar diagnósticos: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
//       } else if (err.request) {
//         console.error("No se recibió respuesta del servidor");
//         setError("Error: No se recibió respuesta del servidor");
//       } else {
//         console.error("Error en la configuración de la solicitud:", err.message);
//         setError(`Error: ${err.message}`);
//       }
//       setCargando(false);
//     }
//   };

//   // Función para seleccionar un diagnóstico específico
//   const seleccionarDiagnostico = async (diagnostico) => {
//     setDiagnosticoSeleccionado(diagnostico);
//     setMostrarDetalles(true);
//   };

//   // Función para procesar los datos del diagnóstico
//   const procesarDatos = (diagnostico) => {
//     if (!diagnostico) return null;

//     // Extraer los datos del diagnóstico para mostrarlos
//     const { porcentajeCumplimiento, categorias, fecha, areasRiesgo } = diagnostico;
    
//     // Formatear los datos para el radar chart
//     const datosRadar = Object.entries(categorias).map(([categoria, datos]) => ({
//       subject: categoria,
//       A: parseFloat(datos.porcentaje.toFixed(2)),
//       preguntas: datos.preguntas.length,
//       fullMark: 100,
//     }));

//     return {
//       porcentajeCumplimiento,
//       datosRadar,
//       fecha,
//       areasRiesgo,
//       categorias
//     };
//   };

//   // Obtener color según el porcentaje de cumplimiento
//   const obtenerColorPorcentaje = (porcentaje) => {
//     if (porcentaje >= 80) return "#4CAF50"; // Verde
//     if (porcentaje >= 60) return "#FFC107"; // Amarillo
//     if (porcentaje >= 40) return "#FF9800"; // Naranja
//     return "#F44336"; // Rojo
//   };

//   // Renderizar gráfico de dona
//   const renderizarGraficoDona = (porcentaje, tamaño = 120) => {
//     const radio = tamaño / 2;
//     const circunferencia = 2 * Math.PI * (radio - 10);
//     const porcentajeCompletado = circunferencia * (1 - porcentaje / 100);
//     const color = obtenerColorPorcentaje(porcentaje);

//     return (
//       <svg width={tamaño} height={tamaño} viewBox={`0 0 ${tamaño} ${tamaño}`}>
//         <circle
//           cx={radio}
//           cy={radio}
//           r={radio - 10}
//           fill="transparent"
//           stroke="#f0f0f0"
//           strokeWidth="8"
//         />
//         <circle
//           cx={radio}
//           cy={radio}
//           r={radio - 10}
//           fill="transparent"
//           stroke={color}
//           strokeWidth="8"
//           strokeDasharray={circunferencia}
//           strokeDashoffset={porcentajeCompletado}
//           transform={`rotate(-90 ${radio} ${radio})`}
//         />
//         <text
//           x="50%"
//           y="50%"
//           dominantBaseline="middle"
//           textAnchor="middle"
//           fontSize="20"
//           fontWeight="bold"
//           fill="#333"
//         >
//           {Math.round(porcentaje)}%
//         </text>
//       </svg>
//     );
//   };

//   // Obtener recomendaciones según la categoría y porcentaje
//   const obtenerRecomendacion = (categoria, porcentaje) => {
//     if (porcentaje >= 60) return null;
    
//     const recomendaciones = {
//       "Compensación y prestaciones sociales": 
//          "Compensación y prestaciones sociales: más que un pago, una obligación legal y reputacional Cumplir correctamente con las obligaciones salariales y prestacionales no solo evita sanciones: construye confianza con los trabajadores y fortalece la reputación de la empresa. Aspectos como los ajustes salariales anuales, el pago correcto de horas extras y recargos, la entrega de dotación, la autorización para trabajo suplementario, y el reconocimiento oportuno de vacaciones, cesantías e intereses, son obligaciones que el Ministerio del Trabajo y la UGPP pueden auditar en cualquier momento. Además, muchos empleadores incurren en errores por falta de formalización de las comisiones, bonificaciones o pagos no salariales, lo que puede derivar en contingencias por liquidaciones mal hechas, demandas laborales o multas de la UGPP.",
      
//       "Litigios o reclamaciones":       
//         "Litigios y reclamaciones: el momento de actuar es ahora, no cuando la sanción llegue Tener investigaciones en curso, procesos sancionatorios o demandas laborales no es solo un síntoma de posibles fallas en la gestión laboral, es también una oportunidad para tomar el control y mitigar riesgos antes de que se materialicen en sanciones, condenas judiciales. Estar en la mira del Ministerio de Trabajo, la UGPP, el SENA o entidades del sistema de protección social requiere una reacción técnica, oportuna y jurídicamente sólida. Cada requerimiento no atendido adecuadamente puede terminar en sanciones millonarias, pérdida de beneficios tributarios, daño reputacional o incluso en responsabilidad penal del representante legal.",
      
//       "Normas laborales": 
//         "Normas laborales: la defensa empieza por los documentos Una gestión laboral sólida no se limita a pagar salarios puntualmente. También exige cumplir con requisitos documentales y contractuales que, si se ignoran, pueden dejar al empleador desprotegido frente a reclamos o sanciones. Las cláusulas especiales (como confidencialidad, no competencia o propiedad intelectual), los procedimientos disciplinarios formales o la documentación al finalizar un contrato, no son simples trámites: son herramientas legales para proteger a la empresa frente a controversias y fiscalizaciones. Lo que muchos descuidan (y luego lamentan): •	Omitir diligencias de descargos antes de una terminación con justa causa puede convertirlo en despido sin justa causa.\n•No entregar documentos al finalizar la relación laboral (liquidación, certificación, paz y salvo, etc.) abre la puerta a reclamaciones posteriores o incluso a que no surta efecto. •	La falta de constancias firmadas sobre entrega de elementos de trabajo, políticas internas y normativas puede generar presunciones en contra del empleador. •	El reglamento de trabajo desactualizado o su inexistencia puede ser sancionado por el Ministerio del Trabajo.",
      
//       "Afiliaciones y seguridad social": 
//         "¿Por qué son importantes las afiliaciones y la seguridad social de los trabajadores?En Colombia, el cumplimiento adecuado del sistema de protección social no es solo una obligación legal: es una garantía de protección el empleador y los trabajadores. Las afiliaciones previas al inicio de labores, el reporte correcto de novedades en la PILA, y la correcta determinación del ingreso base de cotización (IBC) son aspectos que la UGPP y los entes de control vigilan de forma estricta.Omitir, retrasar o manejar mal estos procesos puede traer consecuencias graves: sanciones económicas, procesos judiciales, reclamaciones laborales y pérdida de beneficios fiscales.",
      
//       "Terceros": 
//       "el riesgo oculto que puede generar vínculos laborales no deseados El uso de contratistas y empresas de servicios temporales es una herramienta válida para atender necesidades específicas del negocio. Sin embargo, si no se gestiona correctamente, puede convertirse en una fuente de riesgo jurídico por tercerización ilegal, solidaridad en seguridad social y demandas laborales por contrato realidad. Tener personal (contratistas o trabajadores en misión) que desempeñan funciones permanentes o equivalentes a las de trabajadores directos, sin control ni supervisión jurídica, puede llevar a que se declare la existencia de un contrato realidad, con todas las consecuencias económicas y legales que ello implica. Aspectos clave que no puede pasar por alto: •	Si un contratista realiza funciones permanentes, bajo subordinación, horarios y directrices empresariales, puede haber un contrato realidad.     •	Si no verifica el pago de aportes al sistema de seguridad social por parte de los contratistas, podría ser solidariamente responsable y tributariamente el costo no ser deducible.•Si contrata empresas de servicios temporales, debe asegurarse de que la empresa esté autorizada por el Ministerio del Trabajo y que los trabajadores en misión se requieran por las causales legales expresas.      •	La omisión en la supervisión y documentación de estas relaciones puede acarrear sanciones, condenas y la pérdida de beneficios tributarios o reputacionales.",
      
//       "SGSST": 
//         "SG-SST: más que una obligación, una garantía de protección legal y humana El Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) no es solo un requisito legal. Es una herramienta fundamental para proteger la vida, la salud y el bienestar de los trabajadores, y al mismo tiempo blindar jurídicamente al empleador frente a sanciones y reclamaciones.Cada documento, examen médico, reporte o procedimiento preventivo es una prueba valiosa para demostrar cumplimiento ante una fiscalización, un accidente laboral o una demanda.¿Por qué es clave tener tu SG-SST bien implementado y documentado?•	Porque la falta de implementación puede acarrear sanciones hasta de 500 SMMLV por parte del Ministerio de Trabajo.•	Porque no documentar los exámenes médicos, reportes FURAT o investigaciones de accidentes puede dejarlo sin defensa frente a demandas por enfermedad laboral o culpa patronal.•	Porque un sistema bien estructurado y en funcionamiento real (no solo en papel) reduce el ausentismo, los accidentes y mejora la productividad.•	Porque es obligatorio para todas las empresas, sin importar su tamaño o número de trabajadores.",
      
//       "Contratación": 
//         "Contratación laboral: donde todo comienza… o donde puede comenzar un problema La contratación es el primer paso en la relación laboral, y como tal, debe hacerse con total claridad jurídica. Un contrato bien elaborado, firmado y documentado protege tanto al empleador como al trabajador, y es el principal respaldo en caso de conflictos o fiscalizaciones. Además, cuando se trata de trabajadores extranjeros o menores de edad, la ley colombiana exige requisitos específicos cuyo incumplimiento puede generar sanciones graves. Puntos críticos que no se pueden pasar por alto: •	No contar con contrato escrito firmado puede traer consecuencias jurídicas graves, ya que la ley presume la existencia de una relación laboral con todas sus obligaciones, incluso si se pactó algo distinto verbalmente. •	Si contrata trabajadores extranjeros, se debe reportar su vinculación y retiro ante Migración Colombia, y a verificar que su situación migratoria esté en regla. •	Si contrata menores de edad, debe contar con autorización expresa del Ministerio del Trabajo.",
      
//       "Colectivo": 
//         "La gestión del derecho colectivo: clave para evitar conflictos y fortalecer la empresa La negociación colectiva y las relaciones con organizaciones sindicales no deben verse como un obstáculo, sino como una oportunidad para construir entornos laborales estables, predecibles y ajustados a la normatividad vigente.Contar con una convención o pacto colectivo vigente, o gestionar adecuadamente un pliego de peticiones, no solo es una obligación legal: también es una estrategia inteligente para evitar conflictos, investigaciones del Ministerio de Trabajo, huelgas, suspensión de actividades y demandas."
//     };

//     return recomendaciones[categoria] || "Se recomienda revisar esta área para mejorar el cumplimiento de los requisitos legales y minimizar riesgos laborales.";
//   };

//   // Identificar categorías con bajo cumplimiento
//   const obtenerCategoriasConBajoCumplimiento = (categorias) => {
//     if (!categorias) return [];
    
//     return Object.entries(categorias)
//       .filter(([_, datos]) => datos.porcentaje < 60)
//       .map(([categoria, datos]) => ({
//         nombre: categoria,
//         porcentaje: datos.porcentaje,
//         recomendacion: obtenerRecomendacion(categoria, datos.porcentaje)
//       }));
//   };

//   // Obtener los datos procesados del diagnóstico seleccionado
//   const datosProcesados = diagnosticoSeleccionado ? procesarDatos(diagnosticoSeleccionado) : null;
//   const categoriasConBajoCumplimiento = datosProcesados ? obtenerCategoriasConBajoCumplimiento(datosProcesados.categorias) : [];

//   return (
//     <div className="consulta-resultados-container">
//       <div className="consulta-header">
//         <h1>Consulta de Diagnósticos</h1>
//         <img src={GAP} className="box-gap" alt="Logo GAP" />
//       </div>

//       {/* Panel de búsqueda */}
//       <div className="panel-busqueda">
//         <div className="filtros-busqueda">
//           <select 
//             value={tipoBusqueda} 
//             onChange={(e) => setTipoBusqueda(e.target.value)}
//             className="selector-busqueda"
//           >
//             <option value="identificacion">Identificación</option>
//             <option value="nombre">Nombre</option>
//           </select>
//           <input 
//             type="text" 
//             placeholder="Ingrese término de búsqueda" 
//             value={busqueda} 
//             onChange={(e) => setBusqueda(e.target.value)}
//             className="input-busqueda"
//           />
//           <button 
//             className="btn-buscar"
//             onClick={() => buscarEmpleadores()}
//           >
//             Buscar
//           </button>
//         </div>

//         {/* Resultados de la búsqueda */}
//         {busqueda && (
//           <div className="resultados-busqueda">
//             {buscarEmpleadores()?.length > 0 ? (
//               <div className="lista-empleadores">
//                 <h3>Resultados de la búsqueda</h3>
//                 <table className="tabla-empleadores">
//                   <thead>
//                     <tr>
//                       <th>Identificación</th>
//                       <th>Nombre</th>
//                       <th>Teléfono</th>
//                       <th>Email</th>
//                       <th>Acciones</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {buscarEmpleadores().map((emp) => (
//                       <tr key={emp.id}>
//                         <td>{emp.identificacion}</td>
//                         <td>{emp.nombres}</td>
//                         <td>{emp.telefono}</td>
//                         <td>{emp.email}</td>
//                         <td>
//                           <button 
//                             className="btn-seleccionar"
//                             onClick={() => seleccionarEmpleador(emp)}
//                           >
//                             Ver diagnósticos
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="sin-resultados">
//                 <p>No se encontraron resultados para la búsqueda.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Historial de diagnósticos */}
//       {empleadorSeleccionado && (
//         <div className="historial-diagnosticos">
//           <h2>Diagnósticos de {empleadorSeleccionado.nombres}</h2>
          
//           {cargando ? (
//             <div className="cargando">Cargando diagnósticos...</div>
//           ) : resultadosHistoricos.length > 0 ? (
//             <div className="lista-diagnosticos">
//               <table className="tabla-diagnosticos">
//                 <thead>
//                   <tr>
//                     <th>Fecha</th>
//                     <th>Cumplimiento Global</th>
//                     <th>Áreas de Riesgo</th>
//                     <th>Acciones</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {resultadosHistoricos.map((diag) => (
//                     <tr key={diag.id}>
//                       <td>{new Date(diag.fecha).toLocaleDateString()}</td>
//                       <td>
//                         <div className="porcentaje-item">
//                           <div className="porcentaje-indicador" style={{ backgroundColor: obtenerColorPorcentaje(diag.porcentajeCumplimiento) }}></div>
//                           <span>{Math.round(diag.porcentajeCumplimiento)}%</span>
//                         </div>
//                       </td>
//                       <td>{diag.areasRiesgo?.join(", ") || "Ninguna"}</td>
//                       <td>
//                         <button 
//                           className="btn-ver-detalles"
//                           onClick={() => seleccionarDiagnostico(diag)}
//                         >
//                           Ver detalles
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="sin-diagnosticos">
//               <p>No hay diagnósticos registrados para este empleador.</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Detalles del diagnóstico seleccionado */}
//       {mostrarDetalles && datosProcesados && (
//         <div className="detalles-diagnostico">
//           <h2>Detalles del Diagnóstico</h2>
          
//           <div className="resumen-diagnostico">
//             <div className="grafico-dona">
//               {renderizarGraficoDona(datosProcesados.porcentajeCumplimiento, 150)}
//               <h3>Cumplimiento Global</h3>
//               <div className="estado-cumplimiento">
//                 <span 
//                   className="estado-indicador"
//                   style={{ backgroundColor: obtenerColorPorcentaje(datosProcesados.porcentajeCumplimiento) }}
//                 ></span>
//                 <span className="estado-texto">
//                   {datosProcesados.porcentajeCumplimiento >= 80
//                     ? "Cumplimiento Adecuado"
//                     : datosProcesados.porcentajeCumplimiento >= 60
//                     ? "Requiere Mejoras"
//                     : "Alto Riesgo de Incumplimiento"}
//                 </span>
//               </div>
//             </div>
            
//             <div className="grafico-radar">
//               <RadarChartComponent categorias={datosProcesados.datosRadar} />
//             </div>
//           </div>
          
//           {/* Recomendaciones */}
//           {categoriasConBajoCumplimiento.length > 0 && (
//             <div className="recomendaciones-seccion">
//               <h3>Recomendaciones</h3>
//               <div className="recomendaciones-lista">
//                 {categoriasConBajoCumplimiento.map((categoria, index) => (
//                   <div key={index} className="recomendacion-item">
//                     <div className="recomendacion-header">
//                       <h4>{categoria.nombre}</h4>
//                       <div className="recomendacion-porcentaje" style={{ color: obtenerColorPorcentaje(categoria.porcentaje) }}>
//                         {Math.round(categoria.porcentaje)}%
//                       </div>
//                     </div>
//                     <p className="recomendacion-texto">{categoria.recomendacion}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Botones de acción */}
//           <div className="acciones-diagnostico">
//             <button 
//               className="btn-imprimir"
//               onClick={() => window.print()}
//             >
//               Imprimir Diagnóstico
//             </button>
//             <button 
//               className="btn-ocultar-detalles"
//               onClick={() => setMostrarDetalles(false)}
//             >
//               Ocultar Detalles
//             </button>
//           </div>
//         </div>
//       )}
      
//       {/* Botones de navegación */}
//       <div className="navegacion-botones">
//         <button 
//           className="btn-volver"
//           onClick={() => navigate("/")}
//         >
//           Volver al Inicio
//         </button>
//         <button 
//           className="btn-nuevo-diagnostico"
//           onClick={() => navigate("/diagnostico")}
//         >
//           Nuevo Diagnóstico
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Registros;

