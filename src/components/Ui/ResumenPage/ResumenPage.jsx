import React, { useState } from "react";
import ResumenNomina from "../../Pages/ResumenNomina/ResumenNomina.jsx";

function ResumenPage() {
  const [actualizar, setActualizar] = useState(0);
  return (
    <section className="section-card">
      <h2>Resumen de Nómina</h2>
      <ResumenNomina actualizar={actualizar} />
    </section>
  );
}
export default ResumenPage;
