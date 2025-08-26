import React, { useState } from "react";
import ListaTurnos from "../../Pages/ListarTurnos/ListaTurnos.jsx";
import { ToastContainer } from "react-toastify";


function TurnosPage() {
  const [actualizar, setActualizar] = useState(0);
  return (
    <section className="section-card">
      <ListaTurnos actualizar={actualizar} />      
      <ToastContainer position="top-right" autoClose={4000} />
    </section>
  );
}
export default TurnosPage;
