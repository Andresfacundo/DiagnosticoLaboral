import React, { useState } from "react";
import ListaTurnos from "../../Pages/ListarTurnos/ListaTurnos.jsx";

function TurnosPage() {
  const [actualizar, setActualizar] = useState(0);
  return (
    <section className="section-card">
      <ListaTurnos actualizar={actualizar} />
    </section>
  );
}
export default TurnosPage;
