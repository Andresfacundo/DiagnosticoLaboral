import Reac, { useState, useEffect } from 'react'
import gva from '../../../../public/Gva.png'
import wasa from '../../../../public/whatsapp.svg'
import email from '../../../../public/correo-electronico.svg'
import ubicacion from '../../../../public/mapa.svg'
import './Footer.css'
import { NavLink, useLocation } from 'react-router-dom'
import instagram from '../../../../public/logotipo-de-instagram.svg'
import authService from '../../../Services/authService'


const Footer = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [ userRole, setUserRole] = useState('invitado');
    const location = useLocation();
    
    useEffect(() => {
        const checkAuthStatus = () => {
            // Verificar autenticación
            const authenticated = authService.isAuthenticated();
            setIsAuthenticated(authenticated);
    
            // Obtener el rol del usuario si está autenticado
            if (authenticated) {
                const userData = authService.getUser();
                if (userData && userData.rol) {
                    if (typeof userData.rol === 'object') {
                        if (userData.rol.superadmin) setUserRole('superadmin');
                        else if (userData.rol.admin) setUserRole('admin');
                        else setUserRole('user');
                    } else {
                        setUserRole(userData.rol);
                    }
                }
            } else {
                setUserRole('invitado');
            }
        };
    
        // Verificar al montar y cuando cambie la ubicación
        checkAuthStatus();
        
        // Escuchar cambios en el estado de autenticación
        window.addEventListener('authStateChanged', checkAuthStatus);
        
        // Limpiar el listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('authStateChanged', checkAuthStatus);
        };
    }, [location]);

    // Función para verificar si tiene acceso a cierta funcionalidad
    const hasAccess = (requiredRole) => {
        if (!isAuthenticated) return false;
        if (requiredRole === 'admin') {
            return userRole === 'admin' || userRole === 'superadmin';
        }
        return userRole === requiredRole;
    }; 


    return (
        <div className='content-footer'>
            <div className='content-contacto'>
                <div className='content-img'>
                    <img src={gva} alt="icono-GVA" />
                </div>
                <div className='item-img'><img src={wasa} alt="icono-whatsapp" />(+57) 314 8739679</div>
                <div className='item-img'><img src={instagram} alt="icono-instagram"/><a href="https://www.instagram.com/gomezvalenciaabogados/?igsh=MXB0bDByYmsyNHNpeA%3D%3D#">@gomezvalenciaabogados</a></div>
                <div className='item-img'><img src={email} alt="icono-email" />administrativo@gomezvalencia.com</div>
                <div className='item-img'><img src={ubicacion} alt="icono-ubicacion" />Calle 22 Norte KR #9-18 Barrio coinca</div>
                <div className='item-img'>Lun-Vie: 8:00 - 18:00</div>
            </div>
            <div className='item-interes'>
                <h3>Enlaces de interés</h3>
                <ul>
                    <li><NavLink to='/'>Inicio</NavLink></li>
                    <li><NavLink to='/form'>Diagnóstico</NavLink></li>
                    {hasAccess('admin') && (
                        <li><NavLink to='/questions'>Gestión de preguntas</NavLink></li>
                    )}
                    {hasAccess('admin') && (
                        <li><NavLink to='https://calculadora-gap-six.vercel.app/' target='_blank'>Calculadora</NavLink></li>
                    )}
                    <li><NavLink to='#'>Nosotros</NavLink></li>
                </ul>

            </div>
        </div>
    )
}

export default Footer