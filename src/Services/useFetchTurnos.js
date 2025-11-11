import axios from "axios";
import authService from "./authService";
const API_URL = import.meta.env.VITE_API_URL;

export const turnosFetch = {
    crear: async (trabajadorId, turno) => {
        const token = authService.getToken();
        const res = await axios.post(`${API_URL}/api/turno/${trabajadorId}`, turno, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;

    },
    listar: async (filtros = {}) => {
        const token = authService.getToken();
        const params = new URLSearchParams();

        if(filtros.nombre) params.append("nombre",filtros.nombre);
        if(filtros.apellido) params.append("apellido",filtros.apellido);
        if(filtros.area) params.append("area",filtros.area);
        if(filtros.cc) params.append("cc",filtros.cc);
        if(filtros.diaInicio) params.append("diaInicio",filtros.diaInicio);
        if(filtros.diaFin) params.append("diaFin",filtros.diaFin);
        const res = await axios.get(`${API_URL}/api/turno?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });        
        return res.data;
    },
    listarById: async (id) => {
        const token = authService.getToken();
        const res = await axios.get(`${API_URL}/api/turno/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return res.data;
    },
    editar: async (id, turno) => {
        const token = authService.getToken();
        const res = await axios.patch(`${API_URL}/api/turno/${id}`, turno, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },
    eliminar: async (id) => {
        const token = authService.getToken();
        const res = await axios.delete(`${API_URL}/api/turno/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data
    }

}



