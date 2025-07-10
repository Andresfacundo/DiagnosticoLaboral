import axios from "axios";
import authService from "./authService";
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

export const calcularNomina = async (formData) => {
    try{
        const token = authService.getToken();
        const response = await axios.post(`${API_URL}/api/calcular`, formData,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data
        
    }catch(error){
        console.error('Error al calcular la nomina:', error);
        throw error;
    }
}

