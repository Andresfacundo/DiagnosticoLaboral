import React from 'react'
import { NavLink } from 'react-router-dom'
import './Home.css'


const Home = () => {
    return (
        <div className='box-home'>
                <NavLink to='formulario' >Realizar Diagnóstico</NavLink>
                <NavLink to='preguntas' >Formular preguntas</NavLink>
        </div>
    )
}

export default Home