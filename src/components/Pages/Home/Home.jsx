import React from 'react'
import { NavLink } from 'react-router-dom'


const Home = () => {
  return (
    <div>
        <NavLink to='formulario' >Realizar Diagnostico</NavLink>
        <NavLink to='preguntas' >Formular preguntas</NavLink>

    </div>
  )
}

export default Home