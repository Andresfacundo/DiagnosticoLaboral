import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import GVA from '../GVA/GVA.jsx'
import './Navbar.css'
import user from '../../../../public/usuario.png'
import logout from '../../../../public/cerrar-sesion.png'
import hamburgerIcon from '../../../../public/menu.svg' // You'll need to add this image
import closeIcon from '../../../../public/close-menu.svg' // You'll need to add this image
import axios from 'axios'
import authService from '../../../Services/authService.js'
const API_URL = import.meta.env.VITE_API_URL;

const Navbar = ({id}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('invitado');
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    
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
                    if (userData.rol.superadmin) setUserRole('superadmin');
                    else if (userData.rol.admin) setUserRole('admin');
                    else setUserRole('user');
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
        if (requiredRole === 'admin') {
            return userRole === 'admin' || userRole === 'superadmin';
        }
        return userRole === requiredRole;
    };

    const handleLogout = async () => {
        const token = authService.getToken();
        try {
            if(token){
                await axios.post(`${API_URL}/api/auth/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            authService.logout();
            setIsAuthenticated(false);
            setUserRole('invitado');
            closeMenu();

        } catch (error) {
            console.error('Error durante el logout:', error);
            authService.logout();
            setIsAuthenticated(false);
            setUserRole('invitado');
        }
    }
    
    return (
        <div id={id} className='navbar-container'>
            <nav className='navbar'>
                <div className="navbar-logo">
                    <GVA/>
                </div>
                
                <div className="hamburger-menu">
                    <button onClick={toggleMenu} className="menu-toggle">
                        {menuOpen 
                            ? <img src={closeIcon} alt="Cerrar menú" className="menu-icon" /> 
                            : <img src={hamburgerIcon} alt="Abrir menú" className="menu-icon" />
                        }
                    </button>
                </div>
                <div className='content-list-nav'>
                    <ul className={`nav-list ${menuOpen ? 'nav-active' : ''}`}>
                        <li className='home'><NavLink to='/' onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Inicio</NavLink></li>
                        <li className='diagnostico'><NavLink to='diagnostico' onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Diagnóstico</NavLink></li>
                        
                        {/* Solo mostrar Gestión de preguntas para admin/superadmin */}
                        {hasAccess('admin') && (
                            <li className='preguntas'><NavLink to='questions' onClick={closeMenu} className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Gestión de preguntas</NavLink></li>
                        )}
                        
                        {/* Solo mostrar Calculadora para admin/superadmin */}
                        {hasAccess('admin') && (
                            <li className='calculadora'><a href="https://calculadora-gap-six.vercel.app/" onClick={closeMenu} target='_blank'>Calculadora</a></li>
                        )}
                        
                        {/* <li className='contacto'><NavLink onClick={closeMenu}>Contacto</NavLink></li> */}
                        <li className='nosotros'><NavLink onClick={closeMenu} to='/nosotros'>Nosotros</NavLink></li>
                        
                    </ul>
                        {isAuthenticated ? (
                            <li className='login'>
                                <NavLink to='login' onClick={() => { handleLogout(); closeMenu(); }} className='logout-button boton'>
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
                </div>
            </nav>
        </div>
    )
}

export default Navbar