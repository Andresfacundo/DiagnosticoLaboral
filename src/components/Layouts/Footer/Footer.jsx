import React from 'react'
import gva from '../../../../public/Gva.png'
import wasa from '../../../../public/whatsapp.svg'
import email from '../../../../public/correo-electronico.svg'
import ubicacion from '../../../../public/mapa.svg'
import './Footer.css'
import { NavLink } from 'react-router-dom'
import instagram from '../../../../public/logotipo-de-instagram.svg'


const Footer = () => {
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
                    <li><NavLink to='/questions'>Gestión de preguntas</NavLink></li>
                    <li><NavLink to='https://calculadora-gap-six.vercel.app/' target='_blank'>Calculadora</NavLink></li>
                    <li><NavLink to='#'>Nosotros</NavLink></li>
                </ul>

            </div>
        </div>
    )
}

export default Footer