import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Resultados.css";
import RadarChartComponent from '../../Ui/RadarChart/RadarChartComponent'
import GAP from '../../../../public/gap.png'
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

  const datosRadar = Object.entries(resultados.categorias).map(([categoria, datos]) => ({
    subject: categoria,
    A: parseFloat(datos.porcentaje.toFixed(2)),
    preguntas: datos.preguntas.length,
    fullMark: 100,    
  }));
  
  // Colores para los gráficos
  
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


  const obtenerRecomendacion = (categoria, porcentaje) => {
    if (porcentaje >= 60) return null;
    
    const recomendaciones = {
      "Compensación y prestaciones sociales": 
         `<h4>Más que un pago, una obligación legal y reputacional</h4>
          <p>Cumplir correctamente con las obligaciones salariales y prestacionales no solo evita sanciones: construye confianza con los trabajadores y fortalece la reputación de la empresa.</p>
          <p>Aspectos como los ajustes salariales anuales, el pago correcto de horas extras y recargos, la entrega de dotación, la autorización para trabajo suplementario, y el reconocimiento oportuno de vacaciones, cesantías e intereses, son obligaciones que el Ministerio del Trabajo y la UGPP pueden auditar en cualquier momento.</p>
          <p>Además, muchos empleadores incurren en errores por falta de formalización de las comisiones, bonificaciones o pagos no salariales, lo que puede derivar en contingencias por liquidaciones mal hechas, demandas laborales o multas de la UGPP.</p>`,
      
      "Litigios o reclamaciones":       
        `<h4>El momento de actuar es ahora, no cuando la sanción llegue</h4>
         <p>Tener investigaciones en curso, procesos sancionatorios o demandas laborales no es solo un síntoma de posibles fallas en la gestión laboral, es también una oportunidad para tomar el control y mitigar riesgos antes de que se materialicen en sanciones, condenas judiciales.</p>
         <p>Estar en la mira del Ministerio de Trabajo, la UGPP, el SENA o entidades del sistema de protección social requiere una reacción técnica, oportuna y jurídicamente sólida.</p>
         <p>Cada requerimiento no atendido adecuadamente puede terminar en sanciones millonarias, pérdida de beneficios tributarios, daño reputacional o incluso en responsabilidad penal del representante legal.</p>`,
      
      "Normas laborales": 
        `<h4>La defensa empieza por los documentos</h4>
         <p>Una gestión laboral sólida no se limita a pagar salarios puntualmente. También exige cumplir con requisitos documentales y contractuales que, si se ignoran, pueden dejar al empleador desprotegido frente a reclamos o sanciones.</p>
         <p>Las cláusulas especiales (como confidencialidad, no competencia o propiedad intelectual), los procedimientos disciplinarios formales o la documentación al finalizar un contrato, no son simples trámites: son herramientas legales para proteger a la empresa frente a controversias y fiscalizaciones.</p>
         <p class="subtitulo">Lo que muchos descuidan (y luego lamentan):</p>
         <ul>
           <li>Omitir diligencias de descargos antes de una terminación con justa causa puede convertirlo en despido sin justa causa.</li>
           <li>No entregar documentos al finalizar la relación laboral (liquidación, certificación, paz y salvo, etc.) abre la puerta a reclamaciones posteriores o incluso a que no surta efecto.</li>
           <li>La falta de constancias firmadas sobre entrega de elementos de trabajo, políticas internas y normativas puede generar presunciones en contra del empleador.</li>
           <li>El reglamento de trabajo desactualizado o su inexistencia puede ser sancionado por el Ministerio del Trabajo.</li>
         </ul>`,
      
      "Afiliaciones y seguridad social": 
        `<h4>¿Por qué son importantes las afiliaciones y la seguridad social de los trabajadores?</h4>
         <p>En Colombia, el cumplimiento adecuado del sistema de protección social no es solo una obligación legal: es una garantía de protección el empleador y los trabajadores.</p>
         <p>Las afiliaciones previas al inicio de labores, el reporte correcto de novedades en la PILA, y la correcta determinación del ingreso base de cotización (IBC) son aspectos que la UGPP y los entes de control vigilan de forma estricta.</p>
         <p>Omitir, retrasar o manejar mal estos procesos puede traer consecuencias graves: sanciones económicas, procesos judiciales, reclamaciones laborales y pérdida de beneficios fiscales.</p>`,
      
      "Terceros": 
      `<h4>El riesgo oculto que puede generar vínculos laborales no deseados</h4>
       <p>El uso de contratistas y empresas de servicios temporales es una herramienta válida para atender necesidades específicas del negocio. Sin embargo, si no se gestiona correctamente, puede convertirse en una fuente de riesgo jurídico por tercerización ilegal, solidaridad en seguridad social y demandas laborales por contrato realidad.</p>
       <p>Tener personal (contratistas o trabajadores en misión) que desempeñan funciones permanentes o equivalentes a las de trabajadores directos, sin control ni supervisión jurídica, puede llevar a que se declare la existencia de un contrato realidad, con todas las consecuencias económicas y legales que ello implica.</p>
       <p class="subtitulo">Aspectos clave que no puede pasar por alto:</p>
       <ul>
         <li>Si un contratista realiza funciones permanentes, bajo subordinación, horarios y directrices empresariales, puede haber un contrato realidad.</li>
         <li>Si no verifica el pago de aportes al sistema de seguridad social por parte de los contratistas, podría ser solidariamente responsable y tributariamente el costo no ser deducible.</li>
         <li>Si contrata empresas de servicios temporales, debe asegurarse de que la empresa esté autorizada por el Ministerio del Trabajo y que los trabajadores en misión se requieran por las causales legales expresas.</li>
         <li>La omisión en la supervisión y documentación de estas relaciones puede acarrear sanciones, condenas y la pérdida de beneficios tributarios o reputacionales.</li>
       </ul>`,
      
      "SGSST": 
        `<h4>Más que una obligación, una garantía de protección legal y humana</h4>
         <p>El Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) no es solo un requisito legal. Es una herramienta fundamental para proteger la vida, la salud y el bienestar de los trabajadores, y al mismo tiempo blindar jurídicamente al empleador frente a sanciones y reclamaciones.</p>
         <p>Cada documento, examen médico, reporte o procedimiento preventivo es una prueba valiosa para demostrar cumplimiento ante una fiscalización, un accidente laboral o una demanda.</p>
         <p class="subtitulo">¿Por qué es clave tener tu SG-SST bien implementado y documentado?</p>
         <ul>
           <li>Porque la falta de implementación puede acarrear sanciones hasta de 500 SMMLV por parte del Ministerio de Trabajo.</li>
           <li>Porque no documentar los exámenes médicos, reportes FURAT o investigaciones de accidentes puede dejarlo sin defensa frente a demandas por enfermedad laboral o culpa patronal.</li>
           <li>Porque un sistema bien estructurado y en funcionamiento real (no solo en papel) reduce el ausentismo, los accidentes y mejora la productividad.</li>
           <li>Porque es obligatorio para todas las empresas, sin importar su tamaño o número de trabajadores.</li>
         </ul>`,
      
      "Contratación": 
        `<h4>Donde todo comienza… o donde puede comenzar un problema</h4>
         <p>La contratación es el primer paso en la relación laboral, y como tal, debe hacerse con total claridad jurídica. Un contrato bien elaborado, firmado y documentado protege tanto al empleador como al trabajador, y es el principal respaldo en caso de conflictos o fiscalizaciones.</p>
         <p>Además, cuando se trata de trabajadores extranjeros o menores de edad, la ley colombiana exige requisitos específicos cuyo incumplimiento puede generar sanciones graves.</p>
         <p class="subtitulo">Puntos críticos que no se pueden pasar por alto:</p>
         <ul>
           <li>No contar con contrato escrito firmado puede traer consecuencias jurídicas graves, ya que la ley presume la existencia de una relación laboral con todas sus obligaciones, incluso si se pactó algo distinto verbalmente.</li>
           <li>Si contrata trabajadores extranjeros, se debe reportar su vinculación y retiro ante Migración Colombia, y a verificar que su situación migratoria esté en regla.</li>
           <li>Si contrata menores de edad, debe contar con autorización expresa del Ministerio del Trabajo.</li>
         </ul>`,
      
      "Colectivo": 
        `<h4>Clave para evitar conflictos y fortalecer la empresa</h4>
         <p>La negociación colectiva y las relaciones con organizaciones sindicales no deben verse como un obstáculo, sino como una oportunidad para construir entornos laborales estables, predecibles y ajustados a la normatividad vigente.</p>
         <p>Contar con una convención o pacto colectivo vigente, o gestionar adecuadamente un pliego de peticiones, no solo es una obligación legal: también es una estrategia inteligente para evitar conflictos, investigaciones del Ministerio de Trabajo, huelgas, suspensión de actividades y demandas.</p>`
    };

    return recomendaciones[categoria] || `<p>Se recomienda revisar esta área para mejorar el cumplimiento de los requisitos legales y minimizar riesgos laborales.</p>`;
  };

  const nombreEmpresa = resultados.empleador?.nombres || "No disponible";
  const identificacionEmpresa = resultados.empleador?.identificacion || "No disponible";
  const tipoIdentificacion = resultados.empleador?.tipoDocumento || "";
  const diligenciador = resultados.empleador?.nombreDiligenciador || "No disponible"
  const telefono = resultados.empleador?.telefono || "No disponible"
  const email = resultados.empleador?.email || "No disponible"

  // Identificar categorías con bajo cumplimiento
  const categoriasConBajoCumplimiento = Object.entries(resultados.categorias)
    .filter(([_, datos]) => datos.porcentaje < 60)
    .map(([categoria, datos]) => ({
      nombre: categoria,
      porcentaje: datos.porcentaje,
      recomendacion: obtenerRecomendacion(categoria, datos.porcentaje)
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
            <img src={GAP}className='box-gap'/>
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
            <RadarChartComponent categorias={datosRadar}/>
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