import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Formulario.css'

const Formulario = ({ setPaso }) => {
    const [empleador, setEmpleador] = useState({
        tipo: "",
        nombre: "",
        identificacion: "",
        trabajadores: "",
        contratos: []
    });

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
    };

    const handleSubmit = (e) => {
        // Optional: Add validation before navigation
        if (!empleador.nombre || !empleador.identificacion) {
            e.preventDefault();
            alert("Por favor complete todos los campos obligatorios");
        }
    };

    return (
        <div className="content-form">
            <h2>Información del Empleador</h2>
            
            <div className='content-check' role="group" aria-label="Tipo de Empleador">
                <label>
                    <input 
                        type="radio" 
                        name="tipo" 
                        value="Natural" 
                        checked={empleador.tipo === "Natural"} 
                        onChange={manejarCambio} 
                        id="tipoNatural"
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
                    /> 
                    <label htmlFor="tipoJuridica">Jurídica</label>
                </label>
            </div>
            
            <div className="content-input">
                <input 
                    className='input' 
                    type="text" 
                    name="nombre" 
                    placeholder="Nombre o Razón Social" 
                    value={empleador.nombre} 
                    onChange={manejarCambio} 
                    required 
                    aria-label="Nombre o Razón Social"
                />
                <input 
                    className='input'
                    type="number" 
                    name="identificacion" 
                    placeholder="Número de Identificación" 
                    value={empleador.identificacion} 
                    onChange={manejarCambio} 
                    required 
                    aria-label="Número de Identificación"
                />
                <input 
                    className='input'
                    type="number" 
                    name="trabajadores" 
                    placeholder="Número de Trabajadores" 
                    value={empleador.trabajadores} 
                    onChange={manejarCambio} 
                    min="0" 
                    aria-label="Número de Trabajadores"
                />
            </div>
            
            <div role="group" aria-label="Tipos de Contrato" className="box-checkbox">
                <label className="label1">
                    <input 
                        type="checkbox" 
                        name="contratos" 
                        value="Fijo" 
                        onChange={manejarCambio} 
                        id="contratoFijo"
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
                    /> 
                    <label htmlFor="contratoObra">Obra o Labor</label>
                </label>
            </div>
            
            <button onClick={handleSubmit}>
                <Link to='/cuestionario'>
                    Continuar
                </Link>
            </button>
        </div>
    );
};

export default Formulario;