import React from 'react'
import logo from '../../../assets/Logo.png'
import './Logo.css'
import { Link } from 'react-router-dom'


const Logo = () => {
  return (
    <>
    <div className='content-img'>
        <Link to='/'>
            <img src={logo} alt="GAP" />
        </Link>
    </div>
    </>
  )
}

export default Logo