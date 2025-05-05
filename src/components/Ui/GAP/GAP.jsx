import React from 'react'
import { Link } from 'react-router-dom'
import gap from '../../../../public/gap.png'
import './GAP.css'

const GAP = () => {
  return (
    <>
      <div className='content-gap'>
        <Link to='/'>
          <img src={gap} alt='GAP' />
        </Link>
      </div>
    </> 
  )
}

export default GAP