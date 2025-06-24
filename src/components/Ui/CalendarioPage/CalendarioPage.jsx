import React, { useState, useEffect } from "react";
import CalendarioTurnos from "../../Pages/CalendarioTurnos/CalendarioTurnos";

function CalendarioPage() {
  const [empleados, setEmpleados] = useState([]);
  const [actualizar, setActualizar] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/api/empleados")
      .then(res => res.json())
      .then(data => setEmpleados(data));
  }, [actualizar]);

  return (
    <section className="section-card">
      <CalendarioTurnos empleados={empleados} onTurnoAgregado={() => setActualizar(a => a + 1)} />
    </section>
  );
}
export default CalendarioPage;
