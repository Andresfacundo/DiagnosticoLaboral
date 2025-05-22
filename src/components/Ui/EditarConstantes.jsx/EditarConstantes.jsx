import React, { useEffect, useState } from "react";
import axios from "axios";
import './EditarConstantes.css'
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL

const EditarConstantes = () => {
    const [constantes, setConstantes] = useState({
        salarioMinimo: "",
        auxilioDeTransporte: "",
        UVT: ""
    });
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const formatNumber = (value) => {
        if (!value) return "";
        const parts = value.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    const parseNumber = (formattedValue) => {
        return formattedValue.replace(/,/g, "");
    };


    useEffect(() => {
        // Obtener valores actuales
        axios.get(`${API_URL}/api/constants`).then(res => {
            setConstantes(res.data);
        });
    }, []);

    const handleChange = (e) => {
        const rawValue = parseNumber(e.target.value)
            .replace(/[^0-9.]/g, "") // Permitir números y un punto decimal
            .replace(/(\..*)\./g, '$1'); // Permitir solo un punto decimal

        setConstantes({
            ...constantes,
            [e.target.name]: rawValue
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${API_URL}/api/constants`, {
                salarioMinimo: parseInt(constantes.salarioMinimo),
                auxilioDeTransporte: parseInt(constantes.auxilioDeTransporte),
                UVT: parseInt(constantes.UVT)
            });
            setMensaje("Constantes actualizadas correctamente");
        } catch (error) {
            setMensaje("Error al actualizar las constantes");
        }
    };

    return (
        <div className="editar-constantes">
            <h3>Editar Constantes</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Salario Mínimo:
                    <input
                        type="text"
                        name="salarioMinimo"
                        value={formatNumber(constantes.salarioMinimo)}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        inputMode="numeric"
                    />
                </label>
                <label>
                    Auxilio de Transporte:
                    <input
                        type="text"
                        name="auxilioDeTransporte"
                        value={formatNumber(constantes.auxilioDeTransporte)}
                        onChange={handleChange} // para que solo reciba numeros el input
                        onWheel={(e) => e.target.blur()}// para quitar scrool del input
                        inputMode="numeric"
                    />
                </label>
                <label>
                    UVT:
                    <input
                        type="text"
                        name="UVT"
                        value={formatNumber(constantes.UVT)}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        inputMode="numeric"

                    />
                </label>
                <button type="submit">Guardar</button>
                <button
                    type="button"
                    className="btn-volver"
                    onClick={() => navigate(-1)}>
                    Volver atrás
                </button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default EditarConstantes;