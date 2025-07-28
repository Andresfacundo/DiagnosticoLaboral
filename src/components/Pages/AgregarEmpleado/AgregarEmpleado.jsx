import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import './AgregarEmpleado.css';

const API_URL = import.meta.env.VITE_API_URL;

const formatNumber = (value) => {
  if (!value) return "";
  const parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "$" + parts.join(".");
};

const parseNumber = (formattedValue) => {
  return formattedValue.replace(/\./g, "");
};

const validarEmpleado = (empleado) => {
  const errores = [];

  if (!empleado.nombre || empleado.nombre.trim() === '') {
    errores.push('Nombre es requerido');
  }

  if (!empleado.apellido || empleado.apellido.trim() === '') {
    errores.push('Apellido es requerido');
  }

  if (!empleado.cc || empleado.cc.toString().trim() === '') {
    errores.push('Cédula es requerida');
  }

  if (!empleado.clasificacionPersonal || empleado.clasificacionPersonal.trim() === '') {
    errores.push('Clasificación del personal es requerida');
  } else if (!['Ordinario', 'Direccion, confianza o manejo'].includes(empleado.clasificacionPersonal)) {
    errores.push('Clasificación del personal debe ser "Ordinario" o "Direccion, confianza o manejo"');
  }

  if (!empleado.area || empleado.area.trim() === '') {
    errores.push('Área es requerida');
  }

  if (!empleado.salarioBase || empleado.salarioBase.toString().trim() === '') {
    errores.push('Salario base es requerido');
  }

  return errores;
};

const limpiarDatosEmpleado = (empleado) => {
  return {
    nombre: empleado[NOMBRES_COLUMNAS.nombre] ? empleado[NOMBRES_COLUMNAS.nombre].toString().trim() : '',
    apellido: empleado[NOMBRES_COLUMNAS.apellido] ? empleado[NOMBRES_COLUMNAS.apellido].toString().trim() : '',
    cc: empleado[NOMBRES_COLUMNAS.cc] ? empleado[NOMBRES_COLUMNAS.cc].toString().trim() : '',
    clasificacionPersonal: empleado[NOMBRES_COLUMNAS.clasificacionPersonal] ? empleado[NOMBRES_COLUMNAS.clasificacionPersonal].toString().trim() : '',
    area: empleado[NOMBRES_COLUMNAS.area] ? empleado[NOMBRES_COLUMNAS.area].toString().trim() : '',
    salarioBase: empleado[NOMBRES_COLUMNAS.salarioBase] ? empleado[NOMBRES_COLUMNAS.salarioBase].toString().trim() : ''
  };
};

const NOMBRES_COLUMNAS = {
  nombre: "Nombre",
  apellido: "Apellido",
  cc: "Número de documento",
  clasificacionPersonal: "Clasificación del Personal",
  area: "Área de Trabajo",
  salarioBase: "Salario Base Mensual"
};

const generarPlantillaExcel = () => {
  const encabezados = [
    {
      [NOMBRES_COLUMNAS.nombre]: "",
      [NOMBRES_COLUMNAS.apellido]: "",
      [NOMBRES_COLUMNAS.cc]: "",
      [NOMBRES_COLUMNAS.clasificacionPersonal]: "",
      [NOMBRES_COLUMNAS.area]: "",
      [NOMBRES_COLUMNAS.salarioBase]: ""
    }
  ];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(encabezados);

  const colWidths = [
    { wch: 12 }, // Nombre del Empleado
    { wch: 12 }, // Apellido del Empleado
    { wch: 20 }, // Cédula de Identidad
    { wch: 22 }, // Clasificación del Personal
    { wch: 15 }, // Área de Trabajo
    { wch: 20 }  // Salario Base Mensual
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Empleados");
  XLSX.writeFile(workbook, "Plantilla_Empleados_Carga_Masiva.xlsx");
};

function AgregarEmpleado({ onEmpleadoAgregado }) {
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    cc: "",
    clasificacionPersonal: "",
    area: "",
    salarioBase: "",
    color: getRandomColor(),
  });



  const [cargando, setCargando] = useState(false);
  const dropRef = useRef();
  const fileInputRef = useRef();

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "salarioBase") {
      const rawValue = parseNumber(value).replace(/[^0-9.]/g, "").replace(/(\..*)\./g, '$1');
      setForm({ ...form, [name]: rawValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/empleados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const nuevoEmpleado = await response.json();

      const empleadosGuardados = JSON.parse(localStorage.getItem("empleados")) || [];
      localStorage.setItem("empleados", JSON.stringify([...empleadosGuardados, nuevoEmpleado]));
      window.dispatchEvent(new Event("localStorageUpdated"));

      setForm({
        nombre: "",
        apellido: "",
        cc: "",
        clasificacionPersonal: "",
        area: "",
        salarioBase: "",
        color: getRandomColor(),
      });

      onEmpleadoAgregado();
      alert("Empleado agregado exitosamente");
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      alert(`Error al agregar empleado: ${error.message}`);
    }
  };

  const procesarArchivo = async (file) => {
    if (!file || !file.name.endsWith(".xlsx")) {
      alert("Por favor, selecciona un archivo Excel (.xlsx)");
      return;
    }


    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const empleadosRaw = XLSX.utils.sheet_to_json(sheet);


    if (empleadosRaw.length === 0) {
      alert("El archivo Excel está vacío o no tiene datos válidos");
      return;
    }

    // Limpiar y validar datos
    const empleadosLimpios = empleadosRaw.map(limpiarDatosEmpleado);

    // Validar cada empleado
    const erroresValidacion = [];
    empleadosLimpios.forEach((empleado, index) => {
      const errores = validarEmpleado(empleado);
      if (errores.length > 0) {
        erroresValidacion.push(`Fila ${index + 2}: ${errores.join(', ')}`);
      }
    });

    if (erroresValidacion.length > 0) {
      alert(`Errores de validación encontrados:\n\n${erroresValidacion.join('\n')}`);
      return;
    }



    const res = await fetch(`${API_URL}/api/empleados/carga-masiva`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleadosLimpios)
    });


    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error del servidor:", errorText);
      throw new Error(`Error del servidor: ${res.status} - ${errorText}`);
    }

    const nuevos = await res.json();

    const actuales = JSON.parse(localStorage.getItem("empleados")) || [];
    localStorage.setItem("empleados", JSON.stringify([...actuales, ...nuevos]));
    window.dispatchEvent(new Event("localStorageUpdated"));

    alert(`Se cargaron ${nuevos.length} empleados correctamente`);
    onEmpleadoAgregado();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCargando(true);
    try {
      await procesarArchivo(file);
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error al cargar empleados desde el archivo: ${error.message}`);
    } finally {
      setCargando(false);
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
      e.target.value = '';
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("drag-over");
    setCargando(true);

    try {
      const file = e.dataTransfer.files[0];
      await procesarArchivo(file);
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error al cargar empleados desde el archivo: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("drag-over");
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove("drag-over");
  };

  return (
    <div className="agregar-empleado-wrapper">
      <form onSubmit={handleSubmit} className="agregar-empleado-form">
        <h2>Agregar trabajador</h2>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
        <input type="text" name="cc" placeholder="Cédula" value={form.cc} onChange={handleChange} required onWheel={e => e.target.blur()} />
        <select name="clasificacionPersonal" value={form.clasificacionPersonal} onChange={handleChange} required>
          <option value="" disabled>Clasificación del personal</option>
          <option value="Ordinario">Ordinario</option>
          <option value="Direccion, confianza o manejo">Dirección, confianza o manejo</option>
        </select>
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
        <label>
          Color del empleador:
          <input
            type="color"
            name="color"
            value={form.color}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </label>
        <button type="submit">Agregar</button>

      </form>

      <div
        ref={dropRef}
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{ opacity: cargando ? 0.5 : 1 }}
      >
        {cargando ? (
          <p><strong>Procesando archivo...</strong></p>
        ) : (
          <>
            <p><strong>Arrastra aquí un archivo Excel (.xlsx) para carga masiva de trabajadores</strong> </p>
            <p>o</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="btn-select"
            >
              Seleccionar archivo
            </button>
            <br />
            <button
              className="btn-downloaad"
              onClick={generarPlantillaExcel}
            >
              Descargar plantilla vacía
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AgregarEmpleado;