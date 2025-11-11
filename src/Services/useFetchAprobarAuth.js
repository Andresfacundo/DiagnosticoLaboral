import authService from "./authService";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;



export const aprobarAuth = {
    listarPendientes: async () => {
        const token = authService.getToken();
        const res = await axios.get(`${API_URL}/api/auth/usuarios/pendientes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },


    aprobar: async (id) => {
        const token = authServiceb.getToken()
        const res = await axios.patch(`${API_URL}/api/auth/usuarios/${id}/aprobar`,{}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data
    },

    rechazar: async (id) => {
        const token = authService.getToken();
        const res = await axios.delete(`${API_URL}/api/auth/usuarios${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data
    }
}

export const CompanyAnalysis = () => {
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*, employer:employers(razon_social, id)");
      if (error) throw error;
      return data || [];
    },
  });
}

