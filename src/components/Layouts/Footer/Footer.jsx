import React, { useState, useEffect } from 'react'
import gva from '../../../../public/Gva.png'
import './Footer.css'
import { NavLink, useLocation } from 'react-router-dom'
import authService from '../../../Services/authService'
import Contacto from '../../Pages/Contacto/Contacto'
import GAP from '../../Ui/GAP/GAP'

const UrlWasa = import.meta.env.VITE_WASA;
const gps = import.meta.env.VITE_UBICACION;
const correo = import.meta.env.VITE_EMAIL;
const INSTAGRAM = import.meta.env.VITE_INSTAGRAM;

const Footer = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('invitado');
    const location = useLocation();

    useEffect(() => {
        const checkAuthStatus = () => {
            const authenticated = authService.isAuthenticated();
            setIsAuthenticated(authenticated);

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

        checkAuthStatus();
        window.addEventListener('authStateChanged', checkAuthStatus);
        return () => {
            window.removeEventListener('authStateChanged', checkAuthStatus);
        };
    }, [location]);

    const hasAccess = (requiredRole) => {
        if (!isAuthenticated) return false;
        if (requiredRole === 'admin') {
            return userRole === 'admin' || userRole === 'superadmin';
        }
        return userRole === requiredRole;
    };

    return (
        <div className="footer-wrapper">
            {/* Aquí el formulario Contacto */}
            

            {/* Aquí el contenido del Footer */}
            <div className='box-footer'>
                <div className='content-footer'>
                    <div className='content-contacto'>
                        <div className='content-img'>
                            <img src={gva} alt="icono-GVA" />
                            <GAP/>
                        </div>
                        <div className='item-img'>
                            <i className="fa-brands fa-whatsapp"></i>
                            <a target='_blank' href={UrlWasa}>(+57) 314 8739679</a>
                        </div>
                        <div className='item-img'>
                            <i className="fa-brands fa-instagram"></i>
                            <a href={INSTAGRAM}>@gomezvalenciaabogados</a>
                        </div>
                        <div className='item-img'>
                            <i className="fa-regular fa-envelope"></i>
                            <a target='_blank' href={correo}>administrativo@gomezvalencia.com</a>
                        </div>
                        <div className='item-img'>
                            <i className="fa-solid fa-location-dot"></i>
                            <a target='_blank' href={gps}>Calle 22 Norte #9-18 Barrio coinca, Armenia-Quindío</a>
                        </div>
                        <div className='item-img'>Lunes a Viernes: 8:00 AM a 6:00 PM</div>
                    </div>
                    <div className="contacto-form-wrapper">
                        <Contacto />
                    </div>

                    <div className='item-interes'>
                        <h3>Enlaces de interés</h3>
                        <ul>
                        <li><NavLink to="/">Inicio</NavLink></li>
                           
                            <li><NavLink to='/diagnostico'>Diagnóstico</NavLink></li>
                            {hasAccess('admin') && (
                                <li><NavLink to='/questions'>Gestión de preguntas</NavLink></li>
                            )}
                            {hasAccess('admin') && (
                                <li><NavLink to='https://calculadora-gap-six.vercel.app/' target='_blank'>Calculadora</NavLink></li>
                            )}
                            <li><NavLink to='nosotros'>Nosotros</NavLink></li>
                        </ul>
                    </div>                    
                </div>

                <div className='derechos'>
                    <p>© 2025 DiagnósticoLaboral. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
