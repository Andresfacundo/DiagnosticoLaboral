import React from 'react'
import gva from '../../../../public/Gva.png'
import wasa from '../../../../public/whatsapp.svg'
import email from '../../../../public/correo-electronico.svg'
import ubicacion from '../../../../public/mapa.svg'
import './Footer.css'
import { NavLink } from 'react-router-dom'


const Footer = () => {
    return (
        <div className='content-footer'>
            <div>
                <div className='content-img'>
                    <img src={gva} alt="icono-GVA" />
                </div>
                <div className='item-img'><img src={wasa} alt="" />(+57) 324 646 7069</div>
                <div className='item-img'><img src={email} alt="" />ejemplo@gmail.com</div>
                <div className='item-img'><img src={ubicacion} alt="" />Carrera ejemplo #ejemplo piso 2</div>
                <div className='item-img'>Lun-Vie: 8:00 - 18:00</div>
            </div>
            <div className='item-interes'>
                <h3>Enlaces de interés</h3>
                <ul>
                    <li><NavLink to='/'>Inicio</NavLink></li>
                    <li><NavLink to='/form'>Diagnóstico</NavLink></li>
                    <li><NavLink to='#'>Nosotros</NavLink></li>
                </ul>

            </div>
        </div>
    )
}

export default Footer