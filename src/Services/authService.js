const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const authService = {
    // Guardar token y usuario
    login: (token, user) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // Obtener token
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },
    // Obtener usuario
    getUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user): null;
    },
    // Cerrar sesión
    logout: () => { 
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
    // Verificar si está autenticado
    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    }
 }
 export default authService;