import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de tener axios instalado: npm install axios
import './Formulario.css';
const API_URL = import.meta.env.VITE_API_URL

const Formulario = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [empleador, setEmpleador] = useState({
        tipo: "",
        tipoDocumento: "",
        nombres: "",
        identificacion: "",
        trabajadores: "",
        nombreDiligenciador: "",
        email: "",
        telefono: "",
    });
    
    // Estado para controlar errores
    const [errores, setErrores] = useState({});
    // Estado para mensajes del servidor
    const [serverError, setServerError] = useState(null);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setEmpleador({ ...empleador, [name]: value });
        
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
        if (!empleador.nombres.trim()) {
            nuevosErrores.nombres = "Campo requerido";
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
        if(!empleador.nombreDiligenciador){
            nuevosErrores.nombreDiligenciador = "Campo requerido";
        }
        // Validar email   
        if (!empleador.email) {
            nuevosErrores.email = "Campo requerido";
        } else if (!/\S+@\S+\.\S+/.test(empleador.email)) {
            nuevosErrores.email = "Email inválido";
        }
        // validar telefono 
        if (!empleador.telefono) {
            nuevosErrores.telefono = "Campo requerido";
        } else if (!/^\d+$/.test(empleador.telefono)) {
            nuevosErrores.telefono = "Teléfono inválido";
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
                const response = await axios.post(`${API_URL}/api/empleadores`, empleador);
                const empleadoId = response.data.id;                
                localStorage.setItem("empleadorId", empleadoId);
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
        <section className="content-top">

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
                        className={`input ${errores.nombres ? 'input-error' : ''}`}
                        type="text"
                        name="nombres"
                        placeholder="Nombre o razón social"
                        value={empleador.nombres}
                        onChange={manejarCambio}
                        required
                        aria-label="Nombre o Razón Social"
                        />
                    {errores.nombres && <div className="error-inside">{errores.nombres}</div>}
                </div>
                
                <div className="input-container">
                    <select
                        className={`input ${errores.tipoDocumento ? 'input-error' : ''}`}
                        name="tipoDocumento"
                        value={empleador.tipoDocumento}
                        onChange={manejarCambio}
                        required
                        aria-label="Tipo de documento"
                        >
                        <option value="" disabled>Seleccione tipo de documento</option>
                        <option value="Cédula de ciudadanía">Cédula de Ciudadanía</option>
                        <option value="Cédula de Extranjería">Cédula de Extranjería</option>
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
                        placeholder="Número de identificación (sin dígito de verificación)"
                        value={empleador.identificacion}
                        onChange={manejarCambio}
                        required
                        onWheel={(e) => e.target.blur()}
                        aria-label="Número de Identificación"
                        />
                    {errores.identificacion && <div className="error-inside">{errores.identificacion}</div>}
                </div>
                
                <div className="input-container">
                    <input
                        className={`input ${errores.trabajadores ? 'input-error' : ''}`}
                        type="number"
                        name="trabajadores"
                        placeholder="Número de trabajadores"
                        value={empleador.trabajadores}
                        onChange={manejarCambio}
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        aria-label="Número de Trabajadores"
                    />
                    {errores.trabajadores && <div className="error-inside">{errores.trabajadores}</div>}
                </div>
                <div className="input-container">
                    <input
                        className={`input ${errores.nombreDiligenciador ? 'input-error' : ''}`}
                        type="text"
                        name="nombreDiligenciador"
                        placeholder="Nombre del diligenciador"
                        value={empleador.nombreDiligenciador}
                        onChange={manejarCambio}
                        required                        
                        />
                    {errores.nombreDiligenciador && <div className="error-inside">{errores.nombreDiligenciador}</div>}
                </div>
                <div className="input-container">
                    <input
                        className={`input ${errores.email ? 'input-error' : ''}`}
                        type="text"
                        name="email"
                        placeholder="Correo electrónico"
                        value={empleador.email}
                        onChange={manejarCambio}
                        required                        
                    />
                    {errores.email && <div className="error-inside">{errores.email}</div>}
                </div>
                <div className="input-container">
                    <input
                        className={`input ${errores.telefono ? 'input-error' : ''}`}
                        type="number"
                        name="telefono"
                        placeholder="Celular o Teléfono"
                        value={empleador.telefono}
                        onWheel={(e) => e.target.blur()}
                        onChange={manejarCambio}
                        required                        
                        />
                    {errores.telefono && <div className="error-inside">{errores.telefono}</div>}                    
                </div>
            </div>
            
            <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                >
                {isSubmitting ? 'Enviando...' : 'Continuar'}
            </button>
        </div>
        </section>
    );
};

export default Formulario;