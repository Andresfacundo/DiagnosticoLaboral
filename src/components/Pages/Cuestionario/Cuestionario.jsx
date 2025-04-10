import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Cuestionario.css';

const API_URL = import.meta.env.VITE_API_URL;

const Cuestionario = () => {
    const navigate = useNavigate();
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [progreso, setProgreso] = useState(0);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");
    const [empleadorId, setEmpleadorId] = useState(null);

    useEffect(() => {
        const obtenerPreguntas = async () => {
            try {
                // Obtener el ID del empleador del localStorage
                const idEmpleador = localStorage.getItem("empleadorId");
                if (!idEmpleador) {
                    setError("No se encontró información del empleador. Por favor regrese al inicio.");
                    return;
                }
                // Aseguramos que el ID sea un número si viene como string
                const empleadorIdParsed = JSON.parse(idEmpleador);
                setEmpleadorId(empleadorIdParsed);

                // Obtenemos las preguntas de la API
                const response = await axios.get(`${API_URL}/api/preguntas`);

                // Establecemos las preguntas y creamos el array de respuestas
                setPreguntas(response.data);
                setRespuestas(response.data.map(pregunta => ({
                    id: pregunta.id,
                    respuesta: "",
                    comentario: "",
                    documento: null
                })));

                // Inicializamos el progreso
                setProgreso(0);
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

    const enviarRespuestas = async () => {
        try {
            // Validar que se haya seleccionado una respuesta para la última pregunta
            if (!respuestas[preguntaActual].respuesta) {
                setError("Por favor, seleccione una respuesta antes de enviar.");
                return;
            }

            setError(""); // Limpiar errores previos
            setEnviando(true);

            // Asegurarnos que el empleadorId esté disponible
            if (!empleadorId) {
                throw new Error("ID de empleador no disponible");
            }

            // Guardar las respuestas en localStorage para usarlas en el diagnóstico
            localStorage.setItem("respuestas", JSON.stringify(respuestas));

            // Enviar respuestas al servidor
            await axios.post(`${API_URL}/api/respuestas/${empleadorId}`, {
                respuestas
            });

            // Navegar a la página de diagnóstico
            navigate("/diagnostico");
        } catch (error) {
            console.error("Error al enviar respuestas", error);
            setError("Error al enviar respuestas: " + (error.response?.data?.mensaje || error.message));
        } finally {
            setEnviando(false);
        }
    };

    // Si no hay preguntas o están cargando
    if (preguntas.length === 0) {
        return (
            <div className="cuestionario-container">
                <h2 className="cuestionario-header">Cuestionario</h2>
                {error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <p>Cargando preguntas...</p>
                )}
                {error && (
                    <button className="navigation-button" onClick={() => navigate("/")}>
                        Volver al inicio
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="cuestionario-container">
            <h2 className="cuestionario-header">Responde la pregunta ({preguntaActual + 1}/{preguntas.length})</h2>

            {/* Barra de progreso */}
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progreso}%` }}
                ></div>
            </div>

            {/* Mostrar error si existe */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <p className="question-category">
                {preguntas[preguntaActual].categoria}
            </p>            

            <p className="question-text">
                {preguntas[preguntaActual].texto}
            </p>

            <div className="response-options">
                {["Si", "Si Parcialmente", "No", "N/A"].map((opcion) => (
                    <label
                        key={opcion}
                        className={`response-label ${respuestas[preguntaActual]?.respuesta === opcion ? 'selected' : ''}`}
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
                value={respuestas[preguntaActual]?.comentario || ""}
                onChange={(e) => manejarCambio("comentario", e.target.value)}
            />

            <input
                type="file"
                className="file-input"
                onChange={(e) => manejarCambio("documento", e.target.files[0])}
            />

            {/* Botones de navegación */}
            <div className="navigation-buttons">
                {preguntaActual < preguntas.length - 1 ? (
                    <button
                        className="navigation-button primary"
                        onClick={siguientePregunta}
                    >
                        Siguiente
                    </button>
                ) : (
                    <button
                        className="navigation-button primary"
                        onClick={enviarRespuestas}
                        disabled={enviando}
                    >
                        {enviando ? "Enviando..." : "Finalizar"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Cuestionario;