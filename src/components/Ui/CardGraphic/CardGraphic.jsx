import React from 'react'
import formatCurrency from '../../../utils/formatUtils'


const CardGraphic = ({content,content2,content3,style}) => {
  return (
    <div className={style}>
        <h3>{content}</h3>
        <span>{content2}</span>
        <span>{content3}</span>
    </div>
  )
}

export default CardGraphic