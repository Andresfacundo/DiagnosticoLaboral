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


    useEffect(() => {
        // Obtener valores actuales
        axios.get(`${API_URL}/api/constants`).then(res => {
            setConstantes(res.data);
        });
    }, []);

    const handleChange = (e) => {
        setConstantes({
            ...constantes,
            [e.target.name]: e.target.value.replace(/\D/g, "") // Solo números
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
                        type="number"
                        name="salarioMinimo"
                        value={constantes.salarioMinimo}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Auxilio de Transporte:
                    <input
                        type="number"
                        name="auxilioDeTransporte"
                        value={constantes.auxilioDeTransporte}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    UVT:
                    <input
                        type="number"
                        name="UVT"
                        value={constantes.UVT}
                        onChange={handleChange}
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