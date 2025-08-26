import React, { useState, useEffect } from "react";
import CalendarioTurnos from "../../Pages/CalendarioTurnos/CalendarioTurnos";
const API_URL = import.meta.env.VITE_API_URL;
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CalendarioPage() {
  const [empleados, setEmpleados] = useState([]);
  const [actualizar, setActualizar] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/empleados`)
      .then(res => res.json())
      .then(data => setEmpleados(data));
  }, [actualizar]);

  return (
    <section className="section-card">
      <CalendarioTurnos empleados={empleados} onTurnoAgregado={() => setActualizar(a => a + 1)} />
      <ToastContainer position="top-right" autoClose={4000} />
    </section>
  );
}
export default CalendarioPage;
