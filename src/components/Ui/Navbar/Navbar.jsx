import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import GVA from '../GVA/GVA.jsx'
import './Navbar.css'
import user from '../../../../public/usuario.png'
import logout from '../../../../public/cerrar-sesion.png'
import axios from 'axios'
import authService from '../../../Services/authService.js'
const API_URL = import.meta.env.VITE_API_URL;


const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, [location]);

    const handleLogout = async () => {
        const token = authService.getToken();
        try {
            if(token){
                await axios.post(`${API_URL}/api/auth/logout`,{},{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            authService.logout();
            setIsAuthenticated(false);

        }catch (error){
            console.error('Error durante el logout:',error);
            authService.logout();
            setIsAuthenticated(false);
        }
    }
    return (
        <div className='navbar-container'>
            <nav className='navbar'>
                <GVA/>
                <ul className='nav-list'>
                    <li className='home' ><NavLink to='/' className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Inicio</NavLink></li>
                    <li className='diagnostico'><NavLink to='form' className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Diagnóstico</NavLink></li>
                    <li className='preguntas'><NavLink to='questions' className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Gestión de preguntas</NavLink></li>
                    <li className='calculadora'><a href="https://calculadora-gap-six.vercel.app/" target='_blank'>Calculadora</a></li>
                    <li className='contacto'><NavLink >Contacto</NavLink></li>
                    <li className='nosotros'><NavLink >Nosotros</NavLink></li>
                    {isAuthenticated ? (
                        <li className='login'>
                            <NavLink to='login' onClick={handleLogout} className='logout-button boton'>
                                <img  src={logout}alt='icon-logout' className='logo-user' />
                            </NavLink>
                        </li>
                    ) : (
                        <li className='login'>
                            <NavLink to='login' className={({ isActive }) => isActive ? 'botonActivo' : 'boton'}>
                                <img src={user} alt='icon-user' className='logo-user' />
                            </NavLink>
                        </li>
                    )}
                </ul>
                {/* <Logo /> */}
            </nav>

        </div>
    )
}

export default Navbar