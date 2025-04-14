import React from 'react'
import { Link } from 'react-router-dom'
import Gva from '../../../../public/Gva.png'
import './GVA.css'

const GVA = () => {
  return (
    <>
      <div className='content-gva'>
        <Link to='/'>
          <img src={Gva} alt='Gva' />
        </Link>
      </div>
    </> 
  )
}

export default GVA