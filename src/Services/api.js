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
    try {
        const token = authService.getToken();
        const response = await axios.post(`${API_URL}/api/calcular`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data

    } catch (error) {
        console.error('Error al calcular la nomina:', error);
        throw error;
    }
}

export const trabajadorService = {
    crear: async (data) => {
        const token = authService.getToken()
        const res = await axios.post(`${API_URL}/api/trabajador`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },
    cargaMasiva: async (file) => {
        const token = authService.getToken();
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post(`${API_URL}api/trabajador/carga-masiva`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },

    descargarPlantilla: async () => {
        const response = await axios.get(`${API_URL}/api/trabajadores/plantilla`,{
            responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("Download", "PlantillaTrabajadores.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    },

    listar: async () => {
        const token = authService.getToken();
        const res = await axios.get(`${API_URL}/api/trabajador`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },

    listarById: async (id) => {
        const token = authService.getToken();
        const res = await axios.get(`${API_URL}/api/trabajador/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },

    editar: async (id, data) => {
        const token = authService.getToken();
        const res = await axios.patch(`${API_URL}/api/trabajador/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },
    
    eliminar: async (id) => {
        const token = authService.getToken();
        const res = await axios.delete(`${API_URL}/api/trabajador/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    }
};
