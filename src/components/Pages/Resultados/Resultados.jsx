import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Resultados.css";
import RadarChartComponent from '../../Ui/RadarChart/RadarChartComponent';
import GAP from '../../../../public/gap.png';
import Recomendaciones from "../../Ui/Recomendaciones/Recomendaciones";
import procesarDatos from "../../../utils/diagnosticoUtils";
const API_URL = import.meta.env.VITE_API_URL;

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
  const [categorias, setCategorias] = useState([]);
  
  const obtenerNombreCategoria = (claveCategoria) => {
    const categoria = categorias.find(cat =>
      cat.id == claveCategoria || cat.nombre === claveCategoria
    );
    return categoria ? categoria.nombre : claveCategoria;
  };

  const datosRadar = Object.entries(resultados.categorias).map(([categoria, datos]) => ({
    subject: obtenerNombreCategoria(categoria),
    A: parseFloat(datos.porcentaje.toFixed(2)),
    preguntas: datos.preguntas.length,
    fullMark: 100,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empleadorId = JSON.parse(localStorage.getItem("empleadorId"));

        if (!empleadorId) {
          setResultados(prev => ({
            ...prev,
            loading: false,
            error: "No se encontró información del empleador. Por favor regrese al inicio."
          }));
          return;
        }

        const [empleadorResponse, categoriaRes] = await Promise.all([
          axios.get(`${API_URL}/api/empleadores/${empleadorId}`),
          axios.get(`${API_URL}/api/categorias`),
        ]);
        const empleadorInfo = empleadorResponse.data;
        const responseCategoria = categoriaRes.data;
        setCategorias(responseCategoria);

        let respuestas = JSON.parse(localStorage.getItem("respuestas"));

        if (!respuestas) {
          const respuestasResponse = await axios.get(`${API_URL}/api/respuestas`);
          const respuestasEmpleador = respuestasResponse.data.find(r => r.empleadorId === empleadorId);
          respuestas = respuestasEmpleador ? respuestasEmpleador.respuestas : [];
        }

        const preguntasResponse = await axios.get(`${API_URL}/api/preguntas`);
        const preguntas = preguntasResponse.data;

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

  const nombreEmpresa = resultados.empleador?.nombres || "No disponible";
  const identificacionEmpresa = resultados.empleador?.identificacion || "No disponible";
  const tipoIdentificacion = resultados.empleador?.tipoDocumento || "";
  const diligenciador = resultados.empleador?.nombreDiligenciador || "No disponible";
  const telefono = resultados.empleador?.telefono || "No disponible";
  const email = resultados.empleador?.email || "No disponible";

  const categoriasConBajoCumplimiento = Object.entries(resultados.categorias)
    .filter(([_, datos]) => datos.porcentaje < 60)
    .map(([categoria, datos]) => ({
      nombre: categorias.length > 0 ? obtenerNombreCategoria(categoria) : categoria,
      porcentaje: datos.porcentaje,
      recomendacion: Recomendaciones(categoria, datos.porcentaje)
    }));

  return (
    <div className="diagnostico-container">
      {/* Encabezado con información de la empresa y resumen */}
      <div className="diagnostico-header">
        <div className="empresa-info">
          <div>
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
                <span className="dato-label">Diligenciador: <span className="dato-valor">{diligenciador}</span></span>
              </div>
              <div className="dato-empresa">
                <span className="dato-label">Correo electrónico: <span className="dato-valor">{email}</span></span>
              </div>
              <div className="dato-empresa">
                <span className="dato-label">Telefono: <span className="dato-valor">{telefono}</span></span>
              </div>
              <div className="dato-empresa">
                <span className="dato-label">Fecha: <span className="dato-valor">{resultados.fecha}</span></span>
              </div>
            </div>
          </div>
          <img src={GAP} className='box-gap' alt="GAP" />
        </div>

        <div className="resumen-cumplimiento">
          <div className="resumen-texto">
            <div>
              {renderizarGraficoDona(resultados.porcentajeCumplimiento, 150)}
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
          <div className="grafico-principal">
            <RadarChartComponent categorias={datosRadar} />
          </div>
        </div>
      </div>

      {categoriasConBajoCumplimiento.length > 0 && (
        <div className="recomendaciones-seccion">
          <h2>Recomendaciones</h2>
          <div className="recomendaciones-lista">
            {categoriasConBajoCumplimiento.map((categoria, index) => (
              <div key={index} className="recomendacion-item">
                <div className="recomendacion-header">
                  <h3>{categoria.nombre}</h3>
                  <div className="recomendacion-porcentaje" style={{ color: obtenerColorPorcentaje(categoria.porcentaje) }}>
                    {Math.round(categoria.porcentaje)}%
                  </div>
                </div>
                <div
                  className="recomendacion-contenido"
                  dangerouslySetInnerHTML={{ __html: categoria.recomendacion }}
                />
              </div>
            ))}
          </div>
          <div className='content-description recomendacion-item recomendaciones-seccion'>
            <p>En GAP, contamos con un equipo de abogados especialistas en derecho laboral y seguridad social, donde ponemos a disposición nuestros servicios para identificar los riesgos y ayudar a implementar soluciones que permitan a los empleadores enfocarse en sus negocios.</p>
            <p>Entendemos que la gestión y administración del personal puede ser una tarea compleja y que requiere de un alto nivel de precisión. </p>
            <p>Nuestra prioridad es proporcionar respuestas rápidas, efectivas y eficientes, garantizando que sus necesidades sean atendidas con la máxima prontitud. Además, nuestra amplia experiencia en legislación laboral y seguridad social nos permiten para ofrecer una asesoría personalizada y adaptada a las necesidades específicas de cada cliente. </p>
            <p>En GVA, no creemos en soluciones genéricas, en su lugar, trabajamos para entender las circunstancias únicas.</p>
            <p>A continuación, encuentra una lista enunciativa (no taxativa) de los procesos realizamos en GAP:</p>
            <div className='content-description-item'>
              <ul>
                <li>Revisión de antecedentes</li>
                <li>Programación examen ingreso</li>
                <li>Afiliación seguridad social</li>
                <li>Documentos de contratación</li>
                <li>Registro de novedades y liquidación de nómina</li>
                <li>Reporte de novedades y pre nómina</li>
              </ul>
              <ul>
                <li>Emisión nómina electrónica</li>
                <li>Archivo plano pago de bancos</li>
                <li>Archivo plano seguridad social</li>
                <li>Contabilización nómina</li>
                <li>Liquidación de acreencias laborales</li>
                <li>Certificado laboral</li>
              </ul>
              <ul>
                <li>Certificado de ingresos y retenciones</li>
                <li>Carta autorizando retiro de cesantías</li>
                <li>Documentos de retiro por cualquier causa</li>
                <li>Orden para examen de retiro</li>
              </ul>
            </div>
            <p>Así mismo, el cliente tendrá acceso a los servicios de consultoría en Derecho Laboral (individual y colectivo) y Seguridad Social, incluyendo, pero sin limitarse: </p>
            <p>A. Consultas vía mail, telefónicas.</p>
            <p>B. Contratos y otrosíes, y demás documentos.</p>
            <p>C. Acompañamiento y asesoría virtual en procesos disciplinarios. </p>
            <p>D. Elaboración de esquemas de contratación y compensación. </p>
            <p>E. Proyección y divulgación de reglamentos y/o políticas aplicables. </p>
          </div>
          <div className="aviso-legal recomendacion-item">
            <p><strong>Aviso Legal:</strong> El diagnóstico ofrecido es de carácter orientativo e informativo. No constituye asesoría legal personalizada ni puede ser interpretado como una recomendación jurídica definitiva. Su contenido se genera únicamente a partir de la información suministrada por usted, sin verificación ni validación adicional. Para atender situaciones específicas, recomendamos siempre acudir a un abogado laboral con experiencia. Esta herramienta no crea una relación abogado-cliente ni garantiza la aplicabilidad de los resultados en casos particulares.</p>
          </div>
        </div>
      )}

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

