import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import authService from "../../../Services/authService.js";
import './Sidebar.css';

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('invitado');

      useEffect(() => {
        // Close menu when location changes
        
        // Verificar autenticación
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        // Obtener el rol del usuario si está autenticado
        if (authenticated) {
            const userData = authService.getUser();
            if (userData && userData.rol) {
                // Determinar el rol basado en la estructura del objeto
                if (typeof userData.rol === 'object') {
                    console.log('Objeto rol:', userData.rol);
                    // Si es un objeto, determinar qué tipo de rol tiene
                    if (userData.rol.admin) setUserRole('admin');
                    else if (userData.rol.asociado) setUserRole('asociado');
                    else setUserRole('asociado');
                } else {
                    // Si ya es un string, usarlo directamente
                    setUserRole(userData.rol);
                }
            }
        } else {
            setUserRole('invitado');
        }
    }, [location]);

  const hasAccess = (requiredRole) => {
    if (!isAuthenticated) return false;
    if (requiredRole === 'asociado') {
      return userRole === 'asociado' || userRole === 'admin';
    }
    return userRole === requiredRole;
  };

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Cerrar el menú móvil si se cambia a desktop
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar menú al hacer clic en overlay
  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Cerrar menú al hacer clic en un enlace (móvil)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Toggle del menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isMobile]);

  return (
    <div className="gestion-horarios-layout">
      {/* Botón toggle para móvil */}
      {isMobile && (
        <button
          className="sidebar-toggle"
          onClick={toggleMobileMenu}
          aria-label="Abrir menú de navegación"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* Overlay para móvil */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar-horarios ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <h2>Gestión de Horarios</h2>
        <nav>
          <ul>
            <li>
              <NavLink
                to="empleados"
                className={({ isActive }) => isActive ? "active" : ""}
                onClick={handleLinkClick}
              >
                Trabajadores
              </NavLink>
            </li>
            <li>
              <NavLink
                to="calendario"
                className={({ isActive }) => isActive ? "active" : ""}
                onClick={handleLinkClick}
              >
                Calendario
              </NavLink>
            </li>
            <li>
              <NavLink
                to="turnos"
                className={({ isActive }) => isActive ? "active" : ""}
                onClick={handleLinkClick}
              >
                Turnos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="resumen"
                className={({ isActive }) => isActive ? "active" : ""}
                onClick={handleLinkClick}
              >
                Resumen nómina
              </NavLink>
            </li>
            {hasAccess('admin') && (
            <li>
              <NavLink
                to="configuracion"
                className={({ isActive }) => isActive ? "active" : ""}
                onClick={handleLinkClick}
              >
                Configuracion
              </NavLink>
            </li>
            )}
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="main-horarios-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Sidebar;