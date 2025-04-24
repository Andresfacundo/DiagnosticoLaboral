import React from 'react'

const ItemCaracteristicas = ({ style,className, src, content, content2 }) => {
    return (
        <div className={className}>
            <div className={style}>
                <img src={src} />        
            </div>
            <strong>{content}</strong>
            <p>{content2}</p>
        </div>
    )
}

export default ItemCaracteristicas