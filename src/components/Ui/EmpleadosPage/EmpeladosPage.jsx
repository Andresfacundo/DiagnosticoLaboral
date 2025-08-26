import React, { useState } from "react";
import AgregarEmpleado from "../../Pages/AgregarEmpleado/AgregarEmpleado";
import ListaEmpleados from "../../Pages/ListaEmpleados/ListaEmpleados";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EmpleadosPage() {
  const [actualizar, setActualizar] = useState(0);
  const recargar = () => setActualizar(a => a + 1);

  return (
    <section className="section-card">
      <AgregarEmpleado onEmpleadoAgregado={recargar} />
      <ToastContainer position="top-right" autoClose={4000} />
      <ListaEmpleados actualizar={actualizar} />
    </section>
  );
}
export default EmpleadosPage;
