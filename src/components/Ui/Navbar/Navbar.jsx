import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import GVA from '../GVA/GVA.jsx'
import './Navbar.css'
import user from '../../../../public/usuario.png'
import logout from '../../../../public/cerrar-sesion.png'
import hamburgerIcon from '../../../../public/menu.svg' // You'll need to add this image
import closeIcon from '../../../../public/close-menu.svg' // You'll need to add this image
import axios from 'axios'
import authService from '../../../Services/authService.js'
import gap from '../../../../public/gap.png'
import GAP from '../GAP/GAP.jsx'
import LoggingOut from '../LogoutAutomatico/LoggingOut.jsx'

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = ({id}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('invitado');
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    // Close the menu when a navigation item is clicked
    const closeMenu = () => {
        if (menuOpen) setMenuOpen(false);
    }
    
    useEffect(() => {
        // Close menu when location changes
        closeMenu();
        
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

    // Función para verificar si tiene acceso a cierta funcionalidad
    const hasAccess = (requiredRole) => {
        if (!isAuthenticated) return false;
        if (requiredRole === 'asociado') {
            return userRole === 'asociado' || userRole === 'admin';
        }
        return userRole === requiredRole;
    };
    const handleLogout = async () => {
        const token = authService.getToken();
        try {
            if (token) {
                await axios.post(`${API_URL}/api/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Error durante el logout:', error);
        } finally {
            authService.logout();
            setIsAuthenticated(false);
            setUserRole('invitado');
            navigate('/cerrando-sesion');
        }
    };

    
    return (
        <>
        {isLoggingOut && <LoggingOut />}
        <div id={id} className='navbar-container'>
            <nav className='navbar'>
                <div className='navbar-header'>
                    <div className="navbar-logo">
                        <GVA/>
                        <GAP className='content-gap'/>
                        
                    </div>
                    
                    <div className="hamburger-menu">
                        <button onClick={toggleMenu} className="menu-toggle">
                            {menuOpen 
                                ? <img src={closeIcon} alt="Cerrar menú" className="menu-icon" /> 
                                : <img src={hamburgerIcon} alt="Abrir menú" className="menu-icon" />
                            }
                        </button>
                    </div>
                </div>
                <div className='content-list-nav'>
                    <ul className={`nav-list ${menuOpen ? 'nav-active' : ''}`}>
                        <div className='content-nav-list'>       
                            <li className='diagnostico'><NavLink to='/' onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Diagnóstico laboral</NavLink></li>
                            <li className='home'><NavLink to='/areas-servicio' onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Áreas de servicio</NavLink></li>
                            
                            {/* Solo mostrar Gestión de preguntas para asociado/admin */}
                            {hasAccess('admin') && (
                                <li className='preguntas'><NavLink to='questions' onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Gestión de preguntas</NavLink></li>                            
                            )}
                            {hasAccess('admin') && (
                                <li className='preguntas'><NavLink to='historial' onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Historial</NavLink></li>
                            )}
                            {/* Solo mostrar Calculadora para asociado/admin */}
                            {hasAccess('admin') && (
                                <li className='calculadora'><NavLink to="/form/calculadora" onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Calculadora</NavLink></li>
                            )}
                                                    
                            {/* <li className='contacto'><NavLink onClick={closeMenu}>Contacto</NavLink></li> */}
                            <li className='nosotros'><NavLink onClick={closeMenu} to='/nosotros' className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Nosotros</NavLink></li>
                            <li className='horarios'>
                                <NavLink to='/horarios' onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>
                                    Gestión de horarios
                                </NavLink>
                            </li>

                        </div>
                        
                        {isAuthenticated ? (
                            <li className='login'>
                                <NavLink to='/cerrando-sesion' onClick={() => { handleLogout(); closeMenu(); }} className='logout-button boton'>
                                    <img src={logout} alt='icon-logout' className='logo-user' />
                                    <span className="menu-text">Cerrar sesión</span>
                                </NavLink>
                            </li>
                        ) : (
                            <li className='login'>
                                <NavLink to='login' onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>
                                    <img src={user} alt='icon-user' className='logo-user' />
                                    <span className="menu-text">Iniciar sesión</span>
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
        </> 
    )
}

export default Navbar