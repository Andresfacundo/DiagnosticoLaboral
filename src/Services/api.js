import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL


export const obtenerPreguntas = async () => {
    const response = await axios.get(`${API_URL}/api/preguntas`);
    return response.data;
};

export const agregarPregunta = async (nuevaPregunta) => {
    const response = await axios.post(`${API_URL}/api/preguntas`, nuevaPregunta);
    return response.data;
};

export const eliminarPregunta = async (id) => {
    await axios.delete(`${API_URL}/api/preguntas/${id}`);
};

export const obtenerDiagnostico = async () => {
    const response = await axios.get(`${API_URL}/api/diagnostico`);
    return response.data;
};
