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
    const [EmpleadorId, setEmpleadorId] = useState(null);

    useEffect(() => {
        const obtenerPreguntas = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/preguntas");
                setEmpleadorId(response.data[0].EmpleadorId); // Asignar el EmpleadorId de la primera pregunta
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
        const empleadorId = 1; // Cambia esto por el ID real del empleador si lo tienes guardado en algún lugar (por ejemplo, en localStorage o contexto)
    
        setEnviando(true);
    
        axios.post(`http://localhost:3000/api/respuestas/${empleadorId}`, {
            respuestas
        })
        .then(() => {
            navigate("/diagnostico");
        })
        .catch(error => {
            console.error("Error al enviar respuestas", error);
            setError("Error al enviar respuestas");
        })
        .finally(() => {
            setEnviando(false);
        });
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
