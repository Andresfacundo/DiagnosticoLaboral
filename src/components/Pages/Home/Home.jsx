import React from 'react'
import './Home.css'
import { useEffect } from 'react'
import AreasServicio from '../../Ui/AreasServicio/AreasServicio'


const Home = () => {
    useEffect(() => {
        const textElement = document.getElementById("typingText");
        const words = ["Laboral", "Comercial", "Tributario", "Nómina", "Seguridad social", "Manejo del personal"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentWord = words[wordIndex];
            let displayedText = currentWord.substring(0, charIndex);
            

            textElement.innerHTML = displayedText;

            if (!isDeleting) {
                if (charIndex < currentWord.length) {
                    charIndex++;
                    setTimeout(type, 100);
                } else {
                    isDeleting = true;
                    setTimeout(type, 1000); // pausa antes de borrar
                }
            } else {
                if (charIndex > 0) {
                    charIndex--;
                    setTimeout(type, 50);
                } else {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(type, 500); // pausa antes de escribir otra palabra
                }
            }
        };

        type(); // iniciar animación
    }, []);
    return (
        <div className='box-home'>
            <section className='box-asesoria'>
                <div className='content-home'>
                    <div class="title-container">
                        <h3>Asesoría en</h3>
                        <p id='typingText'></p>
                    </div>
                    <span>
                        Impulsamos el crecimiento de las empresas del Quindío con soluciones legales confiables y cercanas.
                        En GVA, creemos en el poder del talento local. Contamos con un equipo de profesionales altamente capacitados, comprometidos con acompañar a las empresas de nuestra región en sus retos jurídicos.
                        A través del uso de tecnología y un enfoque práctico, brindamos asesoría en derecho laboral, tributario y corporativo, con el objetivo de proteger y fortalecer cada etapa del desarrollo empresarial.
                        Estamos aquí para crecer contigo.
                    </span>
                </div>
            </section>
            <section className='box-caracteristicas'>
                <div className='title-caracteristicas'>
                    <h2>Áreas de servicio</h2>
                    <p>Nuestra plataforma ofrece herramientas para evaluar y mejorar las condiciones laborales</p>
                </div>
                <div className='content-item-caracteristicas'>   

                    <AreasServicio style='content-list-servicios' className='content-card-servicio' nameClass='item-card-servicio' content='Derecho laboral y seguridad' content2={[
                        "Derecho laboral individual.",
                        "Derecho laboral colectivo.",
                        "Sistema de protección social.",
                        "Esquemas de contratación y compensación.",
                        "Reestructuraciones empresariales y planes de retiro.",
                        "Investigaciónes administrativas.",
                        "Ministerio del trabajo y UGPP",
                        "Litigios laborales"]}/>                                
                    <AreasServicio style='content-list-servicios' className='content-card-servicio' nameClass='item-card-servicio' content='Derecho tributario' content2={[
                        "Consultoría tributaria.",
                        "Gestión movimientos contables y tributarios.",
                        "Presentación de impuestos y medios magnéticos.",
                        "Devolución pagos en exceso o de lo no debido.",
                        "Solicitudes de devolución de saldos.",
                        "Planeación tributaria.",
                        "Procesos administrativos y atención a requerimientos.",
                        ]}/>                                
                    <AreasServicio style='content-list-servicios' className='content-card-servicio' nameClass='item-card-servicio' content='Derecho migratorio' content2={[
                        "Trámite de visas.",
                        "Convalidación de títulos profesionales.",
                        "Trámite de visados y regularización.",
                        "Trámites de registro y control.",
                        "Registros.",
                        "Salvoconductos.",
                        "Certificados movimientos migratorios.",
                        "Permisos de entrada"
                        ]}/>                                
                    <AreasServicio style='content-list-servicios' className='content-card-servicio' nameClass='item-card-servicio' content='Derecho comercial' content2={[
                        "Derecho contractual.",
                        "Derecho coporativo.",
                        "Derecho de la propiedad intelectual.",
                        "Derecho de la competencia.",
                        "Derecho del consumidor.",
                        "Protección de datos personales.",
                        "E-Commerce.",
                        "Derecho inmobiliario."
                        ]}/>                                
                    <AreasServicio style='content-list-servicios' className='content-card-servicio' nameClass='item-card-servicio' content='Derecho civil' content2={[
                        "Derecho de familia.",
                        "Derecho de sucesiones.",
                        "Derecho de bienes y patrimonios.",
                        "Procesos ejecutivos."
                        ]}/>                                                
                </div>


            </section>
            {/* <Footer/> */}



        </div>
    )
}

export default Home