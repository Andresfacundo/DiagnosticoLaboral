import React, { useState } from "react";
import './AgregarEmpleado.css';
const API_URL = import.meta.env.VITE_API_URL;

const formatNumber = (value) => {
  if (!value) return "";
  const parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(".");
};

const parseNumber = (formattedValue) => {
  return formattedValue.replace(/\./g, "");
};

function AgregarEmpleado({ onEmpleadoAgregado }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    cc: "",
    clasificacionPersonal: "",
    area: "",
    salarioBase: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "salarioBase") {
      const rawValue = parseNumber(value)
        .replace(/[^0-9.]/g, "") // Solo números y un punto decimal
        .replace(/(\..*)\./g, '$1'); // Solo un punto decimal
      setForm({ ...form, [name]: rawValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const response = await fetch(`${API_URL}/api/empleados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const nuevoEmpleado = await response.json();

    const empleadosGuardados = JSON.parse(localStorage.getItem("empleados")) || [];
    const nuevosEmpleados = [...empleadosGuardados, nuevoEmpleado];
    localStorage.setItem("empleados", JSON.stringify(nuevosEmpleados));
    window.dispatchEvent(new Event("localStorageUpdated"));

    setForm({
      nombre: "",
      apellido: "",
      cc: "",
      clasificacionPersonal: "",
      area: "",
      salarioBase: ""
    });

    onEmpleadoAgregado();
  };

  return (
    <form onSubmit={handleSubmit} className="agregar-empleado-form">
      <h2>Agregar Empleado</h2>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
      <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
      <input name="cc" placeholder="Cédula" value={form.cc} onChange={handleChange} required />
      <input name="clasificacionPersonal" placeholder="Clasificación del personal" value={form.clasificacionPersonal} onChange={handleChange} required />
      <input name="area" placeholder="Área" value={form.area} onChange={handleChange} required />
      <input
        name="salarioBase"
        type="text"
        inputMode="numeric"
        placeholder="Salario base mensual"
        value={formatNumber(form.salarioBase)}
        onChange={handleChange}
        onWheel={e => e.target.blur()}
        required
      />
      <button type="submit">Agregar</button>
    </form>
  );
}

export default AgregarEmpleado;