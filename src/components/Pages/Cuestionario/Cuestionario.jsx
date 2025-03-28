// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Cuestionario = () => {
//     const [paso,setPaso] = useState(0);
//     const navigate = useNavigate();
//     const [preguntas, setPreguntas] = useState([]);
//     const [respuestas, setRespuestas] = useState([]);
//     const [preguntaActual, setPreguntaActual] = useState(0);
//     const [progreso, setProgreso] = useState(0);
//     const [enviando, setEnviando] = useState(false);

//     useEffect(() => {
//         axios.get("http://localhost:3000/preguntas")
//             .then(response => {
//                 setPreguntas(response.data);
//                 setRespuestas(response.data.map(pregunta => ({
//                     id: pregunta.id,
//                     respuesta: "",
//                     comentario: "",
//                     documento: null
//                 })));
//             })
//             .catch(error => console.error("Error al obtener preguntas", error));
//     }, []);

//     const manejarCambio = (campo, valor) => {
//         setRespuestas((prev) =>
//             prev.map((respuesta, index) =>
//                 index === preguntaActual ? { ...respuesta, [campo]: valor } : respuesta
//             )
//         );
//     };

//     const siguientePregunta = () => {
//         if (preguntaActual < preguntas.length - 1) {
//             setPreguntaActual(preguntaActual + 1);
//             setProgreso(((preguntaActual + 1) / preguntas.length) * 100);
//         }
//         console.log(preguntaActual);
        
//     };

//     const enviarRespuestas = () => {
//         setEnviando(true);

//         axios.post("http://localhost:3000/respuestas", { respuestasUsuario:respuestas })
//             .then(() => {
//                 localStorage.setItem("respuestas", JSON.stringify(respuestas));
//                 setPaso(3);
//                 navigate("/diagnostico");
//             })
//             .catch(error => {
//                 console.error("Error al enviar respuestas", error);
//             })
//             .finally(() => {
//                 setEnviando(false);
//             });
//             console.log(JSON.stringify({respuestasUsuario:respuestas}));
            
//     };

//     return (
//         <div>
//             <h2>Responde la pregunta</h2>

//             {preguntas.length > 0 && (
//                 <div>
//                     {/* Barra de progreso */}
//                     <div style={{ width: "100%", backgroundColor: "#e0e0e0", height: "10px", marginBottom: "10px" }}>
//                         <div style={{ width: `${progreso}%`, height: "100%", backgroundColor: "#4caf50" }}></div>
//                     </div>

//                     <p>{preguntas[preguntaActual].texto}</p>

//                     {/* Opciones de respuesta */}
//                     <label>
//                         <input type="radio" name="respuesta" value="Sí"
//                             checked={respuestas[preguntaActual]?.respuesta === "Sí"}
//                             onChange={(e) => manejarCambio("respuesta", e.target.value)}
//                         /> Sí
//                     </label>
//                     <label>
//                         <input type="radio" name="respuesta" value="No"
//                             checked={respuestas[preguntaActual]?.respuesta === "No"}
//                             onChange={(e) => manejarCambio("respuesta", e.target.value)}
//                         /> No
//                     </label>
//                     <label>
//                         <input type="radio" name="respuesta" value="N/A"
//                             checked={respuestas[preguntaActual]?.respuesta === "N/A"}
//                             onChange={(e) => manejarCambio("respuesta", e.target.value)}
//                         /> N/A
//                     </label>

//                     {/* Comentario */}
//                     <textarea
//                         placeholder="Comentario opcional"
//                         value={respuestas[preguntaActual]?.comentario}
//                         onChange={(e) => manejarCambio("comentario", e.target.value)}
//                     />

//                     {/* Subir documento */}
//                     <input
//                         type="file"
//                         onChange={(e) => manejarCambio("documento", e.target.files[0])}
//                     />

//                     {/* Botón "Siguiente" o "Enviar respuestas" */}
//                     {preguntaActual < preguntas.length - 1 ? (
//                         <button onClick={siguientePregunta}>Siguiente</button>
//                     ) : (
//                         <button onClick={enviarRespuestas} disabled={enviando}>
//                             {enviando ? "Enviando..." : "Enviar respuestas"}
//                         </button>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Cuestionario;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Cuestionario.css';

const Cuestionario = () => {
    
    const navigate = useNavigate();
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [progreso, setProgreso] = useState(0);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const obtenerPreguntas = async () => {
            try {
                const response = await axios.get("http://localhost:3000/preguntas");
                setPreguntas(response.data);
                setRespuestas(response.data.map(pregunta => ({
                    id: pregunta.id,
                    respuesta: "",
                    comentario: "",
                    documento: null
                })));
            } catch (error) {
                console.error("Error al obtener preguntas", error);
                setError("No se pudieron cargar las preguntas. Intente nuevamente.");
            }
        };

        obtenerPreguntas();
    }, []);

    const manejarCambio = (campo, valor) => {
        setRespuestas((prev) =>
            prev.map((respuesta, index) =>
                index === preguntaActual ? { ...respuesta, [campo]: valor } : respuesta
            )
        );
    };

    const siguientePregunta = () => {
        // Validar que se haya seleccionado una respuesta
        if (!respuestas[preguntaActual].respuesta) {
            setError("Por favor, seleccione una respuesta antes de continuar.");
            return;
        }

        setError(""); // Limpiar cualquier error previo

        if (preguntaActual < preguntas.length - 1) {
            setPreguntaActual(preguntaActual + 1);
            setProgreso(((preguntaActual + 1) / preguntas.length) * 100);
        }
    };
    const enviarRespuestas = () => {
                setEnviando(true);
        
                axios.post("http://localhost:3000/respuestas", { respuestasUsuario:respuestas })
                    .then(() => {
                        localStorage.setItem("respuestas", JSON.stringify(respuestas));
                        
                        
                        navigate("/diagnostico");
                    })
                    .catch(error => {
                        console.error("Error al enviar respuestas", error);
                    })
                    .finally(() => {
                        setEnviando(false);
                    });
                    console.log(JSON.stringify({respuestasUsuario:respuestas}));
                    
            };

    // No hay preguntas
    if (preguntas.length === 0) {
        return (
            <div className="cuestionario-container">
                <h2 className="cuestionario-header">Cuestionario</h2>
                <p>No hay preguntas disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <div className="cuestionario-container">
            <h2 className="cuestionario-header">Responde la pregunta</h2>

            {/* Barra de progreso */}
            <div className="progress-bar-container">
                <div 
                    className="progress-bar" 
                    style={{ width: `${progreso}%` }}
                ></div>
            </div>

            {/* Mostrar error si existe */}
            {error && (
                <div style={{ 
                    color: 'red', 
                    marginBottom: '1rem', 
                    textAlign: 'center' 
                }}>
                    {error}
                </div>
            )}

            <p className="question-text">
                {preguntas[preguntaActual].texto}
            </p>

            <div className="response-options">
                {["Sí", "No", "N/A"].map((opcion) => (
                    <label 
                        key={opcion} 
                        className="response-label"
                    >
                        <input 
                            type="radio" 
                            name="respuesta" 
                            value={opcion}
                            checked={respuestas[preguntaActual]?.respuesta === opcion}
                            onChange={(e) => manejarCambio("respuesta", e.target.value)}
                        /> 
                        {opcion}
                    </label>
                ))}
            </div>

            <textarea
                className="comment-textarea"
                placeholder="Comentario opcional"
                value={respuestas[preguntaActual]?.comentario}
                onChange={(e) => manejarCambio("comentario", e.target.value)}
            />

            <input
                type="file"
                className="file-input"
                onChange={(e) => manejarCambio("documento", e.target.files[0])}
                placeholder="Subir documento"
            />

            {/* Botón de navegación */}
            {preguntaActual < preguntas.length - 1 ? (
                <button 
                    className="navigation-button" 
                    onClick={siguientePregunta}
                >
                    Siguiente Pregunta
                </button>
            ) : (
                <button 
                    className="navigation-button" 
                    onClick={enviarRespuestas} 
                    disabled={enviando}
                >
                    {enviando ? "Enviando..." : "Enviar Respuestas"}
                </button>
            )}
        </div>
    );
};

export default Cuestionario;
