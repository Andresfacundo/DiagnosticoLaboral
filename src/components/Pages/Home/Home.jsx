import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Users, Building, Calculator, Globe, Briefcase, Scale } from 'lucide-react'
import './Home.css'

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    
    // Auto-play functionality
    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % serviceAreas.length)
            }, 5000) // Cambia cada 5 segundos
            
            return () => clearInterval(interval)
        }
    }, [isPaused])
    
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

    const serviceAreas = [
        {
            title: "Gestión y administración de personal",
            icon: <Users className="service-icon" />,
            services: [
                "Revisión de antecedentes.",
                "Programación examen ingreso.",
                "Afiliación seguridad social.",
                "Documentos de contratación.",
                "Registro de novedades y liquidación de nómina.",
                "Reporte de novedades y pre nómina.",
                "Emisión nómina electrónica.",
                "Archivo plano pago de bancos.",
                "Archivo plano seguridad social.",
                "Contabilización nómina.",
                "Liquidación de acreencias laborales.",
                "Certificado laboral.",
                "Certificado de ingresos y retenciones.",
                "Carta autorizando retiro de cesantías.",
                "Documentos de retiro por cualquier causa.",
                "Orden para examen de retiro."
            ],
            description: "Así mismo, el cliente tendrá acceso a los servicios de consultoría en Derecho Laboral (individual y colectivo) y Seguridad Social."
        },
        {
            title: "Derecho laboral y seguridad",
            icon: <Scale className="service-icon" />,
            services: [
                "Derecho laboral individual.",
                "Derecho laboral colectivo.",
                "Sistema de protección social.",
                "Esquemas de contratación y compensación.",
                "Reestructuraciones empresariales y planes de retiro.",
                "Investigaciónes administrativas.",
                "Ministerio del trabajo y UGPP",
                "Litigios laborales"
            ]
        },
        {
            title: "Derecho tributario",
            icon: <Calculator className="service-icon" />,
            services: [
                "Consultoría tributaria.",
                "Gestión movimientos contables y tributarios.",
                "Presentación de impuestos y medios magnéticos.",
                "Devolución pagos en exceso o de lo no debido.",
                "Solicitudes de devolución de saldos.",
                "Planeación tributaria.",
                "Procesos administrativos y atención a requerimientos."
            ]
        },
        {
            title: "Derecho migratorio",
            icon: <Globe className="service-icon" />,
            services: [
                "Trámite de visas.",
                "Convalidación de títulos profesionales.",
                "Trámite de visados y regularización.",
                "Trámites de registro y control.",
                "Registros.",
                "Salvoconductos.",
                "Certificados movimientos migratorios.",
                "Permisos de entrada"
            ]
        },
        {
            title: "Derecho comercial",
            icon: <Briefcase className="service-icon" />,
            services: [
                "Derecho contractual.",
                "Derecho corporativo.",
                "Derecho de la propiedad intelectual.",
                "Derecho de la competencia.",
                "Derecho del consumidor.",
                "Protección de datos personales.",
                "E-Commerce.",
                "Derecho inmobiliario."
            ]
        },
        {
            title: "Derecho civil",
            icon: <Building className="service-icon" />,
            services: [
                "Derecho de familia.",
                "Derecho de sucesiones.",
                "Derecho de bienes y patrimonios.",
                "Procesos ejecutivos."
            ]
        }
    ]

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % serviceAreas.length)
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 3000) // Pausa por 3 segundos después de interacción manual
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + serviceAreas.length) % serviceAreas.length)
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 3000)
    }

    const goToSlide = (index) => {
        setCurrentSlide(index)
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 3000)
    }

    return (
        <div className='box-home'>
            <section className='box-asesoria'>
                <div className='content-home'>
                    <div className="title-container">
                        <h3>Asesoría en</h3>
                        <p id='typingText'></p>
                    </div>
                    <span>
                        Impulsamos el crecimiento empresarial con soluciones legales confiables y cercanas. 
                        En GVA contamos con un equipo de profesionales altamente capacitados, comprometidos 
                        con acompañar a las empresas en los retos jurídicos del giro ordinario de sus negocios. 
                        A través del uso de tecnología y un enfoque práctico, brindamos asesoría en derecho laboral,
                        tributario y corporativo, con el objetivo de proteger y fortalecer cada etapa del desarrollo 
                        empresarial. Estamos aquí para crecer contigo.
                    </span>
                    <span>
                        Impulsamos el crecimiento empresarial con soluciones legales confiables. 
                        Nuestro equipo de profesionales brinda asesoría especializada en derecho 
                        laboral, tributario y corporativo para proteger y fortalecer su negocio.
                    </span>
                </div>
            </section>
            <section className='box-caracteristicas'>
                <div className='title-caracteristicas'>
                    <h2>Áreas de servicio</h2>                    
                </div>
                
                {/* Carousel Container */}
                <div className="carousel-wrapper">
                    {/* Main Carousel */}
                    <div 
                        className="carousel-container"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div 
                            className="carousel-track"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {serviceAreas.map((area, index) => (
                                <div key={index} className="carousel-slide">
                                    <div className="slide-content">
                                        {/* Header */}
                                        <div className="slide-header">
                                            <div className="slide-icon-container">
                                                {area.icon}
                                            </div>
                                            <h3 className="slide-title">
                                                {area.title}
                                            </h3>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="slide-body">
                                            {/* Services List */}
                                            <div className="services-list-container">
                                                <h4 className="services-list-title">
                                                    Servicios incluidos:
                                                </h4>
                                                <div className="services-list">
                                                    {area.services.map((service, idx) => (
                                                        <div key={idx} className="service-item">
                                                            <div className="service-bullet"></div>
                                                            <span className="service-text">
                                                                {service}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Additional Info */}
                                            <div className="additional-info">
                                                {area.description && (
                                                    <div className="info-with-description">
                                                        <p className="area-description">{area.description}</p>
                                                        <div className="additional-services">
                                                            <p><strong>A.</strong> Consultas vía mail, telefónicas.</p>
                                                            <p><strong>B.</strong> Contratos y otrosíes, y demás documentos.</p>
                                                            <p><strong>C.</strong> Acompañamiento y asesoría virtual en procesos disciplinarios.</p>
                                                            <p><strong>D.</strong> Elaboración de esquemas de contratación y compensación.</p>
                                                            <p><strong>E.</strong> Proyección y divulgación de reglamentos y/o políticas aplicables.</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {!area.description && (
                                                    <div className="info-without-description">
                                                        <div className="info-icon">{area.icon}</div>
                                                        <p className="info-text">
                                                            Servicios especializados en {area.title.toLowerCase()}
                                                            con el respaldo de nuestro equipo de expertos.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="nav-button nav-button-left"
                    >
                        <ChevronLeft className="nav-icon" />
                    </button>
                    
                    <button
                        onClick={nextSlide}
                        className="nav-button nav-button-right"
                    >
                        <ChevronRight className="nav-icon" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar"
                        style={{ 
                            width: `${((currentSlide + 1) / serviceAreas.length) * 100}%` 
                        }}
                    ></div>
                </div>

                {/* Dots Indicator */}
                <div className="dots-container">
                    {serviceAreas.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`dot ${currentSlide === index ? 'dot-active' : ''}`}
                        >
                            {currentSlide === index && !isPaused && (
                                <div className="dot-animation"></div>
                            )}
                        </button>
                    ))}
                </div>


                {/* Service Area Thumbnails */}
                <div className="thumbnails-grid">
                    {serviceAreas.map((area, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`thumbnail ${currentSlide === index ? 'thumbnail-active' : ''}`}
                        >
                            <div className="thumbnail-content">
                                <div className="thumbnail-icon">
                                    {area.icon}
                                </div>
                                <span className="thumbnail-title">
                                    {area.title}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Home