import React, { useState } from "react";
import AgregarEmpleado from "../../Pages/AgregarEmpleado/AgregarEmpleado";
import ListaEmpleados from "../../Pages/ListaEmpleados/ListaEmpleados";

function EmpleadosPage() {
  const [actualizar, setActualizar] = useState(0);
  const recargar = () => setActualizar(a => a + 1);

  return (
    <section className="section-card">
      <AgregarEmpleado onEmpleadoAgregado={recargar} />
      <ListaEmpleados actualizar={actualizar} />
    </section>
  );
}
export default EmpleadosPage;
