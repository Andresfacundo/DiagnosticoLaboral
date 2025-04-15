import React from 'react'
import { NavLink } from 'react-router-dom'
import './Home.css'
import { useEffect } from 'react'


const Home = () => {
    useEffect(() => {
        const textElement = document.getElementById("typingText");
        const words = ["Laboral", "Tributario", "Corporativo", "Jurídico", "Empresarial"];
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

                <span>En GVA, trabajamos con talento local para impulsar el crecimiento de las empresas en el Quindío.
                    Somos un equipo altamente capacitado que combina experiencia jurídica con el uso de tecnología para ofrecer soluciones efectivas en derecho laboral, tributario y corporativo.
                    Nos comprometemos con cada cliente, acompañando su gestión empresarial y aportando valor real desde lo legal, con cercanía, excelencia y conocimiento del entorno regional.
                </span>
            </div>

        </div>
    )
}

export default Home