import React from 'react'
import { Link } from 'react-router-dom'
import gap from '../../../../public/gap.png'

const GAP = ({className}) => {
  return (
    <>
      <div className={className}>
        <Link to='/'>
          <img src={gap} alt='GAP' />
        </Link>
      </div>
    </> 
  )
}

export default GAP