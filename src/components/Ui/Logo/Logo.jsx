import React from 'react'
import logo from '../../../../public/logo.png'
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