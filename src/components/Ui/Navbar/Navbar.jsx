import React from 'react'
import Logo from '../Logo/Logo'
import { NavLink } from 'react-router-dom'
import GVA from '../GVA/GVA.jsx'
import './Navbar.css'

const Navbar = () => {
    return (
        <div className='navbar-container'>
            <nav className='navbar'>
                <GVA/>
                <ul className='nav-list'>
                    <li className='home' ><NavLink to='/' className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Inicio</NavLink></li>
                    <li className='diagnostico'><NavLink to='form' className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Diagnostico</NavLink></li>
                    <li className='preguntas'><NavLink to='questions' className={({isActive}) => isActive ? 'botonActivo' : 'boton'}>Gestión de preguntas</NavLink></li>
                    <li className='contacto'><NavLink >Contacto</NavLink></li>
                    <li className='nosotros'><NavLink >Nosotros</NavLink></li>
                </ul>
                <Logo />
            </nav>

        </div>
    )
}

export default Navbar