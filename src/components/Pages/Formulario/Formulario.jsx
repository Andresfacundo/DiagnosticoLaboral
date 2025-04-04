import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de tener axios instalado: npm install axios
import './Formulario.css';

// URL base de la API
const API_URL = "http://localhost:3000"; // Debe coincidir con el puerto de tu servidor Express

const Formulario = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [empleador, setEmpleador] = useState({
        tipo: "",
        tipoDocumento: "",
        nombre: "",
        identificacion: "",
        trabajadores: "",
        contratos: []
    });
    
    // Estado para controlar errores
    const [errores, setErrores] = useState({});
    // Estado para mensajes del servidor
    const [serverError, setServerError] = useState(null);

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setEmpleador((prev) => ({
                ...prev,
                contratos: checked
                    ? [...prev.contratos, value]
                    : prev.contratos.filter((c) => c !== value)
            }));
        } else {
            setEmpleador({ ...empleador, [name]: value });
        }
        
        // Limpiar el error del campo que se está editando
        if (errores[name]) {
            setErrores({
                ...errores,
                [name]: ""
            });
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        
        // Validar tipo de empleador
        if (!empleador.tipo) {
            nuevosErrores.tipo = "Seleccione un tipo";
        }
        
        // Validar nombre
        if (!empleador.nombre.trim()) {
            nuevosErrores.nombre = "Campo requerido";
        }
        
        // Validar tipo de documento
        if (!empleador.tipoDocumento) {
            nuevosErrores.tipoDocumento = "Seleccione documento";
        }
        
        // Validar identificación
        if (!empleador.identificacion) {
            nuevosErrores.identificacion = "Campo requerido";
        }
        
        // Validar número de trabajadores
        if (!empleador.trabajadores) {
            nuevosErrores.trabajadores = "Campo requerido";
        }
        
        // Validar que haya al menos un tipo de contrato seleccionado
        if (empleador.contratos.length === 0) {
            nuevosErrores.contratos = "Seleccione al menos uno";
        }
        
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validarFormulario()) {
            setIsSubmitting(true);
            setServerError(null);
            
            try {
                // Llamada al endpoint para guardar los datos del empleador
                const response = await axios.post(`${API_URL}/empleadores`, empleador);
                
                // Guardar el ID del empleador en localStorage para usar en otros componentes
                localStorage.setItem('empleadorId', response.data.empleador.id);
                localStorage.setItem('empleadorNombre', response.data.empleador.nombre);
                
                // Si todo sale bien, navegar al siguiente componente
                navigate('/cuestionario');
            } catch (error) {
                console.error("Error al enviar datos:", error);
                
                // Mostrar errores del servidor si los hay
                if (error.response && error.response.data) {
                    if (error.response.data.errores) {
                        setErrores(error.response.data.errores);
                    }
                    setServerError(
                        error.response.data.mensaje || 
                        "Ocurrió un error al procesar la solicitud. Por favor intente nuevamente."
                    );
                } else {
                    setServerError("Error de conexión con el servidor. Por favor intente más tarde.");
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="content-form">
            <h2>Información del Empleador</h2>
            
            {serverError && (
                <div className="server-error-message">
                    {serverError}
                </div>
            )}
            
            <div className='content-check' role="group" aria-label="Tipo de Empleador">
                <label>
                    <input
                        type="radio"
                        name="tipo"
                        value="Natural"
                        checked={empleador.tipo === "Natural"}
                        onChange={manejarCambio}
                        id="tipoNatural"
                        className={errores.tipo ? 'input-error' : ''}
                    />
                    <label htmlFor="tipoNatural">Natural</label>
                </label>
                <label>
                    <input
                        type="radio"
                        name="tipo"
                        value="Jurídica"
                        checked={empleador.tipo === "Jurídica"}
                        onChange={manejarCambio}
                        id="tipoJuridica"
                        className={errores.tipo ? 'input-error' : ''}
                    />
                    <label htmlFor="tipoJuridica">Jurídica</label>
                </label>
                {errores.tipo && <div className="error-radio">{errores.tipo}</div>}
            </div>
            
            <div className="content-input">
                <div className="input-container">
                    <input
                        className={`input ${errores.nombre ? 'input-error' : ''}`}
                        type="text"
                        name="nombre"
                        placeholder="Nombre o Razón Social"
                        value={empleador.nombre}
                        onChange={manejarCambio}
                        required
                        aria-label="Nombre o Razón Social"
                    />
                    {errores.nombre && <div className="error-inside">{errores.nombre}</div>}
                </div>
                
                <div className="input-container">
                    <select
                        className={`input ${errores.tipoDocumento ? 'input-error' : ''}`}
                        name="tipoDocumento"
                        value={empleador.tipoDocumento}
                        onChange={manejarCambio}
                        required
                        aria-label="Tipo de Documento"
                    >
                        <option value="" disabled>Seleccione tipo de documento</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="NIT">NIT</option>
                        <option value="Pasaporte">Pasaporte</option>
                    </select>
                    {errores.tipoDocumento && <div className="error-inside">{errores.tipoDocumento}</div>}
                </div>
                
                <div className="input-container">
                    <input
                        className={`input ${errores.identificacion ? 'input-error' : ''}`}
                        type="number"
                        name="identificacion"
                        placeholder="Número de Identificación"
                        value={empleador.identificacion}
                        onChange={manejarCambio}
                        required
                        aria-label="Número de Identificación"
                    />
                    {errores.identificacion && <div className="error-inside">{errores.identificacion}</div>}
                </div>
                
                <div className="input-container">
                    <input
                        className={`input ${errores.trabajadores ? 'input-error' : ''}`}
                        type="number"
                        name="trabajadores"
                        placeholder="Número de Trabajadores"
                        value={empleador.trabajadores}
                        onChange={manejarCambio}
                        min="0"
                        aria-label="Número de Trabajadores"
                    />
                    {errores.trabajadores && <div className="error-inside">{errores.trabajadores}</div>}
                </div>
            </div>
            
            <div role="group" aria-label="Tipos de Contrato" className="box-checkbox">
                <label className="label1">
                    <input
                        type="checkbox"
                        name="contratos"
                        value="Fijo"
                        onChange={manejarCambio}
                        id="contratoFijo"
                        className={errores.contratos ? 'input-error' : ''}
                        checked={empleador.contratos.includes('Fijo')}
                    />
                    <label htmlFor="contratoFijo">Término Fijo</label>
                </label>
                <label className="label1">
                    <input
                        type="checkbox"
                        name="contratos"
                        value="Indefinido"
                        onChange={manejarCambio}
                        id="contratoIndefinido"
                        className={errores.contratos ? 'input-error' : ''}
                        checked={empleador.contratos.includes('Indefinido')}
                    />
                    <label htmlFor="contratoIndefinido">Término Indefinido</label>
                </label>
                <label className="label1">
                    <input
                        type="checkbox"
                        name="contratos"
                        value="Obra"
                        onChange={manejarCambio}
                        id="contratoObra"
                        className={errores.contratos ? 'input-error' : ''}
                        checked={empleador.contratos.includes('Obra')}
                    />
                    <label htmlFor="contratoObra">Obra o Labor</label>
                </label>
                {errores.contratos && <div className="error-checkbox">{errores.contratos}</div>}
            </div>
            
            <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Enviando...' : 'Continuar'}
            </button>
        </div>
    );
};

export default Formulario;