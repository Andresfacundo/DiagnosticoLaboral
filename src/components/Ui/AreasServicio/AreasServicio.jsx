import React from 'react'
import './AreasServicio.css'

const AreasServicio = ({ content, content2, className, nameClass, style}) => {
    return (
        <div className={className}>
            <div className={nameClass}>
                <h3>{content}</h3>
            </div>
            <div className={style}>
                <ul>
                    {Array.isArray(content2) && 
                        content2.map((item, index) => <li key={index}>{item}</li>)}                    
                </ul>               
            </div>

        </div>
    )
}

export default AreasServicio