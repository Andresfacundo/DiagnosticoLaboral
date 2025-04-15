import React from 'react'
import { NavLink } from 'react-router-dom'
import './Home.css'
import { useEffect } from 'react'


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

            <div className='content-home'>
                <div class="title-container">
                    <h3>Acompañamiento</h3>
                    <p id='typingText'></p>
                </div>

                <span>Impulsamos el crecimiento de las empresas del Quindío con soluciones legales confiables y cercanas.
En GVA, creemos en el poder del talento local. Contamos con un equipo de profesionales altamente capacitados, comprometidos con acompañar a las empresas de nuestra región en sus retos jurídicos.
A través del uso de tecnología y un enfoque práctico, brindamos asesoría en derecho laboral, tributario y corporativo, con el objetivo de proteger y fortalecer cada etapa del desarrollo empresarial.
Estamos aquí para crecer contigo.
                </span>
            </div>

        </div>
    )
}

export default Home