import React from 'react'

const Recomendaciones = (categoria, porcentaje) => {
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

  export default Recomendaciones;