import authService from "./authService"
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


export const registroExtrasFetch = {
    listar: async (filtros = {}) => {
        const token = authService.getToken();
        const params = new URLSearchParams();

        if (filtros.nombre) params.append("nombre", filtros.nombre);
        if (filtros.apellido) params.append("apellido", filtros.apellido);
        if (filtros.area) params.append("area", filtros.area);
        if (filtros.cc) params.append("cc", filtros.cc);
        if (filtros.diaInicio) params.append("diaInicio", filtros.diaInicio);
        if (filtros.diaFin) params.append("diaFin", filtros.diaFin);
        


        const res = await axios.get(`${API_URL}/api/detalle-turnos?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data
    }
}

