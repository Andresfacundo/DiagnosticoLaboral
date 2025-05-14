import React, { useState } from "react";
import gomez from "../../../assets/Group 17.png";
import "../../../components/SalaryCalculator.css";
import "./Formulario.css";
import Calculadora from "../../../assets/calculator-line.png";
import { calcularNomina } from "../../../services/services.js";
import Navbar from "../../UI/Navbar/Navbar.jsx";
import "../../UI/Navbar/Navbar.css";
import ok from "../../../assets/ok.png";

const Formulario = () => {
  const salarioMinimo = 1423500;

  const [formData, setFormData] = useState({
    tipoSalario: "", // Changed default to empty to force selection
    salario: "",
    otrosPagosSalariales: "",
    otrosPagosNoSalariales: "",
    auxilioDeTransporte: "Si",
    auxilioAlimentacion: "",
    pensionado: "No",
    exonerado: "Si",
    claseRiesgo: "1",
    deducciones: "",
    retencionFuente: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({}); // Add state for form errors

  // Función para formatear números con separadores de miles
  const formatNumber = (value) => {
    if (!value) return "";
    
    // Elimina todos los caracteres no numéricos excepto el punto decimal
    const numericValue = value.toString().replace(/[^\d.]/g, '');
    
    // Parsea el valor y lo formatea con separadores de miles
    const number = parseFloat(numericValue);
    
    if (isNaN(number)) return "";
    
    // Formatea el número con separadores de miles (usando el formato colombiano)
    return number.toLocaleString('es-CO');
  };

  // Función para convertir el valor formateado de vuelta a número
  const parseFormattedNumber = (formattedValue) => {
    if (!formattedValue) return "";
    // Elimina todos los separadores de miles
    return formattedValue.replace(/\./g, '');
  };

  // Validate field function
  const validateField = (name, value) => {
    let errors = {...formErrors};
    
    if (name === 'tipoSalario' && !value) {
      errors.tipoSalario = 'Debe seleccionar un tipo de salario';
    } else if (name === 'tipoSalario') {
      delete errors.tipoSalario;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    validateField(name, value);
    
    // Si es un campo numérico, aplicamos el formato
    const numericFields = ['salario', 'otrosPagosSalariales', 'otrosPagosNoSalariales', 'deducciones', 'retencionFuente'];
    
    if (numericFields.includes(name)) {
      // Guardamos el valor sin formato para cálculos
      const rawValue = parseFormattedNumber(value);
      
      setFormData((prev) => {
        // Calcular la suma del salario y otros pagos salariales
        const nuevoSalario = name === 'salario' ? parseFloat(rawValue) || 0 : parseFloat(parseFormattedNumber(prev.salario)) || 0;
        const nuevosOtrosPagos = name === 'otrosPagosSalariales' ? parseFloat(rawValue) || 0 : parseFloat(parseFormattedNumber(prev.otrosPagosSalariales)) || 0;
        const sumaSalarial = nuevoSalario + nuevosOtrosPagos;
        
        return {
          ...prev,
          [name]: formatNumber(rawValue), // Guardamos el valor formateado para mostrar
          ...(sumaSalarial > (salarioMinimo * 2) ? { auxilioDeTransporte: "No" } : {})
        };
      });
    } else {
      // Para campos no numéricos, mantenemos el comportamiento original
      setFormData((prev) => {
        return {
          ...prev,
          [name]: value
        };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let hasErrors = false;
    let newErrors = {};
    
    if (!formData.tipoSalario) {
      newErrors.tipoSalario = 'Debe seleccionar un tipo de salario';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setFormErrors(newErrors);
      return; // Prevent form submission if there are errors
    }

    try {
      // Convertimos todos los valores formateados a números antes de enviar
      const dataToSend = {
        ...formData,
        salario: parseFloat(parseFormattedNumber(formData.salario)) || 0,
        otrosPagosSalariales: parseFloat(parseFormattedNumber(formData.otrosPagosSalariales)) || 0,
        otrosPagosNoSalariales: parseFloat(parseFormattedNumber(formData.otrosPagosNoSalariales)) || 0,
        deducciones: parseFloat(parseFormattedNumber(formData.deducciones)) || 0,
        retencionFuente: parseFloat(parseFormattedNumber(formData.retencionFuente)) || 0,
        auxilioTransporte: parseFloat(formData.auxilioDeTransporte === "Si" ? "1" : "0") || 0,
      };

      const data = await calcularNomina(dataToSend);
      const storedResults = localStorage.getItem("Resultados");
      const resultArray = storedResults ? JSON.parse(storedResults) : [];
      resultArray.push(data);
      
      localStorage.setItem("Resultados", JSON.stringify(resultArray));

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Actualizar la lógica para mostrar el campo de auxilio de transporte
  const salarioValue = parseFloat(parseFormattedNumber(formData.salario)) || 0;
  const otrosPagosSalarialesValue = parseFloat(parseFormattedNumber(formData.otrosPagosSalariales)) || 0;
  const showAuxilioTransporte = (salarioValue + otrosPagosSalarialesValue) <= (salarioMinimo * 2);

  return (
    <div className="calculator-container">
      <h1>Calculadora Laboral</h1>
      {showAlert && (
        <div className='alert'>
          <img src={ok} alt="icono" /> ¡Cálculo de Nómina realizado con éxito!
        </div>
      )}
      <div className="calculator-card">
        <div className="container-button">
          <Navbar />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de salario</label>
              <select
                id="tipoSalario"
                name="tipoSalario"
                value={formData.tipoSalario}
                onChange={handleInputChange}
                required
                className={formErrors.tipoSalario ? "input-error" : ""}
              >
                <option value="">--Seleccione--</option>
                <option value="Ordinario">Ordinario</option>
                <option value="Integral">Integral</option>
              </select>
         
            </div>

            <div className="form-group">
              <label>Salario</label>
              <input
                id="salario"
                name="salario"
                value={formData.salario}
                onChange={handleInputChange}
                required
                placeholder="$"
              />
            </div>
            <div className="form-group">
              <label>Otros Pagos Salariales</label>
              <input
                id="otrosPagosSalariales"
                name="otrosPagosSalariales"
                value={formData.otrosPagosSalariales}
                onChange={handleInputChange}
                placeholder="$"
              />
            </div>

            <div className="form-group">
              <label>OtrosPagos No salariales</label>
              <input
                id="otrosPagosNoSalariales"
                name="otrosPagosNoSalariales"
                value={formData.otrosPagosNoSalariales}
                onChange={handleInputChange}
                placeholder="$"
              />
            </div>
            <div className="form-group">
              <label>Retencion En La fuente</label>
              <input
                id="retencionFuente"
                name="retencionFuente"
                value={formData.retencionFuente}
                onChange={handleInputChange}
                placeholder="$"
              />
            </div>
            <div className="form-group">
              <label>Deducciones</label>
              <input
                id="deducciones"
                name="deducciones"
                value={formData.deducciones}
                onChange={handleInputChange}
                placeholder="$"
              />
            </div>
            <div className="form-group">
              <label>Pensionado</label>
              <select
                id="pensionado"
                name="pensionado"
                value={formData.pensionado}
                onChange={handleInputChange}
              >
                <option value="No">No</option>
                <option value="Si">Sí</option>
              </select>
            </div>
            <div className="form-group">
              <label>Exonerado</label>
              <select
                id="exonerado"
                name="exonerado"
                value={formData.exonerado}
                onChange={handleInputChange}
              >
                <option value="No">No</option>
                <option value="Si">Sí</option>
              </select>
            </div>
            <div className="form-group">
              <label>Clase de riesgo</label>
              <select
                id="claseRiesgo"
                name="claseRiesgo"
                value={formData.claseRiesgo}
                onChange={handleInputChange}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            
            {showAuxilioTransporte && (
              <div className="form-group">
                <label>Auxilio de Transporte</label>
                <select
                  id="auxilioDeTransporte"
                  name="auxilioDeTransporte"
                  value={formData.auxilioDeTransporte}
                  onChange={handleInputChange}
                >
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}
          </div>
          <div className="nomina">
            <button type="submit">
              <img src={Calculadora} alt="icono" />
              Calcular Nómina
            </button>

            <img className='gomez' src={gomez} alt="icono" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formulario;