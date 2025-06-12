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
    const [diagnostico, setDiagnostico] = useState(null);
    const [categorias, setCategorias] = useState([]);    

    useEffect(() => {
        const obtenerPreguntas = async () => {
            try {
                const idEmpleador = localStorage.getItem("empleadorId");
                if (!idEmpleador) {
                    setError("No se encontró información del empleador. Por favor regrese al inicio.");
                    return;
                }
                // Aseguramos que el ID sea un número si viene como string
                const empleadorIdParsed = JSON.parse(idEmpleador);
                setEmpleadorId(empleadorIdParsed);

                // Obtenemos las preguntas de la API
                const [preguntasRes, categoriasRes] = await Promise.all([
                    axios.get(`${API_URL}/api/preguntas`),
                    axios.get(`${API_URL}/api/categorias`),
                    
                ]) 

                setPreguntas(preguntasRes.data);
                setCategorias(categoriasRes.data);
                setRespuestas(preguntasRes.data.map(pregunta => ({
                    id: pregunta.id,
                    respuesta: "",
                    comentario: "",
                    documento: null
                })));
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
        if (!respuestas[preguntaActual].respuesta) {
            setError("Por favor, seleccione una respuesta antes de continuar.");
            return;
        }

        setError("");

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

            setError(""); 
            setEnviando(true);

            if (!empleadorId) {
                throw new Error("ID de empleador no disponible");
            }

            // Guardar respuestas en localStorage
            localStorage.setItem("respuestas", JSON.stringify(respuestas));

            // Primero obtener las preguntas actualizadas para asegurarnos de tener todos los pesos
            const preguntasResponse = await axios.get(`${API_URL}/api/preguntas`);
            const preguntasActualizadas = preguntasResponse.data;

            // Procesar el diagnóstico en el backend enviando respuestas y preguntas
            const diagnosticoResponse = await axios.post(`${API_URL}/api/diagnostico`, {
                respuestas: respuestas,
                preguntas: preguntasActualizadas
            });
            
            // Guardar el resultado completo del diagnóstico
            if (diagnosticoResponse.data) {
                localStorage.setItem("diagnosticoCompleto", JSON.stringify(diagnosticoResponse.data));
                setDiagnostico(diagnosticoResponse.data);
            }

            // Opcional: guardar también las respuestas en el backend si se requiere
            await axios.post(`${API_URL}/api/respuestas/${empleadorId}`, {
                respuestas
            });

            // Navegar a la página de resultados
            navigate("/resultados");
        } catch (error) {
            console.error("Error al procesar diagnóstico", error);
            setError("Error al generar el diagnóstico: " + (error.response?.data?.message || error.message));
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

    // Si ya se obtuvo un diagnóstico pero aún no se navega
    if (diagnostico) {
        return (
            <div className="cuestionario-container">
                <h2 className="cuestionario-header">Diagnóstico Completado</h2>
                <p>Su diagnóstico ha sido generado exitosamente.</p>
                <button className="navigation-button primary" onClick={() => navigate("/resultados")}>
                    Ver Resultados
                </button>
            </div>
        );
    }

    return (
        <div className="cuestionario-container">
            <p className="cuestionario-header">Pregunta  {preguntaActual + 1} de {preguntas.length}</p>

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
            <div>
                    {categorias[preguntaActual] && (
                        <p className="question-category">
                            {categorias[preguntaActual].nombre}
                        </p>
                    )}

            </div>

            <h2 className="question-text">
                {preguntas[preguntaActual].texto}
            </h2>

            <div className="response-options">
                {["Si", "Parcialmente", "No", "No aplica"].map((opcion) => (
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

            {/* <input
                type="file"
                className="file-input"
                onChange={(e) => manejarCambio("documento", e.target.files[0])}
            /> */}

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