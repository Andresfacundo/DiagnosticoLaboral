import React from 'react'
import '../AreasServicio/AreasServicio.css'
import gap from '../../../../public/gap.png'

const AreasServicio = ({ content, content2, className, style2, nameClass, style }) => {
    return (
        <div className={className}>
            <div className={nameClass}>
                <h3>{content}</h3>
            </div>
            <div className={style}>
                <div className='services-gap'>
                    <ul>
                        {Array.isArray(content2) &&
                            content2.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                    <div>
                        <img src={gap} alt="" />
                    </div>
                </div>

                <div className={style2}>
                    <p>Así mismo, el cliente tendrá acceso a los servicios de consultoría en Derecho Laboral (individual y colectivo) y Seguridad Social, incluyendo, pero sin limitarse: </p>
                    <p><strong>A.</strong> Consultas vía mail, telefónicas.</p>
                    <p><strong>B.</strong> Contratos y otrosíes, y demás documentos.</p>
                    <p><strong>C.</strong> Acompañamiento y asesoría virtual en procesos disciplinarios. </p>
                    <p><strong>D.</strong> Elaboración de esquemas de contratación y compensación. </p>
                    <p><strong>E.</strong> Proyección y divulgación de reglamentos y/o políticas aplicables.</p>
                </div>

            </div>

        </div>
    )
}

export default AreasServicio