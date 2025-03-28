// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import * as Recharts from "recharts";



// const Resultados = () => {
//   const navigate = useNavigate();
//   const [datosGrafico, setDatosGrafico] = useState([]);

//   useEffect(() => {
//     // Obtener respuestas desde LocalStorage o API
//     const respuestas = JSON.parse(localStorage.getItem("respuestas")) || [];
//     const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];

//     if (respuestas.length === 0 || preguntas.length === 0) {
//       navigate("/"); // Si no hay datos, redirige al inicio
//       return;
//     }

//     // Calcular puntajes por categoría
//     const resultados = calcularPuntajes(respuestas, preguntas);
//     setDatosGrafico(resultados);
//   }, [navigate]);

//   const calcularPuntajes = (respuestas, preguntas) => {
//     const categorias = {};

//     respuestas.forEach((respuesta) => {
//       const pregunta = preguntas.find((p) => p.id === respuesta.preguntaId);
//       if (!pregunta) return;

//       const peso = pregunta.peso || 1; // Si no tiene peso asignado, usa 1
//       const puntaje = respuesta.valor === "Sí" ? 100 : respuesta.valor === "No" ? 0 : 50;

//       if (!categorias[pregunta.categoria]) {
//         categorias[pregunta.categoria] = { total: 0, pesoTotal: 0 };
//       }

//       categorias[pregunta.categoria].total += puntaje * peso;
//       categorias[pregunta.categoria].pesoTotal += peso;
//     });

//     return Object.keys(categorias).map((categoria) => ({
//       nombre: categoria,
//       cumplimiento: Math.round(categorias[categoria].total / categorias[categoria].pesoTotal),
//     }));
//   };

//   return (
//     <div className="contenedor">
//       <h2>Resultados del Diagnóstico</h2>

//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={datosGrafico}>
//           <XAxis dataKey="nombre" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="cumplimiento" fill="#007bff" />
//         </BarChart>
//       </ResponsiveContainer>

//       <button className="boton-pdf" onClick={() => alert("Descargar informe en PDF")}>
//         Descargar Informe PDF
//       </button>
//     </div>
//   );
// };

// export default Resultados;
