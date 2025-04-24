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
        return user ? JSON.parse(user) : null;
    },
    
    // Nuevo método: Obtener el rol del usuario
    getUserRole: () => {
        const userData = authService.getUser();
        
        if (!userData || !userData.rol) {
            return 'invitado';
        }
        
        // Si rol es un objeto, determinar el rol real
        if (typeof userData.rol === 'object') {
            if (userData.rol.superadmin) return 'superadmin';
            if (userData.rol.admin) return 'admin';
            return 'user';
        }
        
        // Si es un string, devolverlo directamente
        return userData.rol;
    },
    
    // Verificar si el usuario tiene un rol específico
    hasRole: (requiredRole) => {
        const userRole = authService.getUserRole();
        
        if (requiredRole === 'admin') {
            return userRole === 'admin' || userRole === 'superadmin';
        }
        return userRole === requiredRole;
    },
    
    // Cerrar sesión
    logout: () => { 
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        
        window.dispatchEvent(new Event('authStateChanged'));
    },
    
    // Verificar si está autenticado
    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    }
}

export default authService;