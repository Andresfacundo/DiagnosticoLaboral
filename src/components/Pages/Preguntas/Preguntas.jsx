import { useState, useEffect } from "react";
import axios from "axios";
import './Preguntas.css'

const Preguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [texto, setTexto] = useState("");
    const [peso, setPeso] = useState("");
    const [editando, setEditando] = useState(null);
    const [error, setError] = useState("");

    // Obtener preguntas desde el backend
    useEffect(() => {
        const obtenerPreguntas = async () => {
            try {
                const response = await axios.get("http://localhost:3000/preguntas");
                setPreguntas(response.data);
            } catch (error) {
                console.error("Error al obtener preguntas", error);
                setError("No se pudieron cargar las preguntas. Intente nuevamente.");
            }
        };

        obtenerPreguntas();
    }, []);

    // Agregar o editar una pregunta
    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        if (!texto.trim()) {
            setError("El texto de la pregunta es obligatorio");
            return;
        }

        if (!peso || isNaN(Number(peso)) || Number(peso) <= 0) {
            setError("El peso debe ser un número positivo");
            return;
        }

        const nuevaPregunta = { texto: texto.trim(), peso: Number(peso) };

        try {
            if (editando) {
                // Editar pregunta existente
                const response = await axios.put(`http://localhost:3000/preguntas/${editando}`, nuevaPregunta);
                setPreguntas(preguntas.map(p => p.id === editando ? response.data : p));
                setEditando(null);
            } else {
                // Agregar nueva pregunta
                const response = await axios.post("http://localhost:3000/preguntas", nuevaPregunta);
                setPreguntas([...preguntas, response.data]);
            }

            // Limpiar campos
            setTexto("");
            setPeso("");
        } catch (error) {
            console.error("Error en la operación", error);
            setError("No se pudo completar la operación. Intente nuevamente.");
        }
    };

    // Eliminar una pregunta
    const eliminarPregunta = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/preguntas/${id}`);
            setPreguntas(preguntas.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error al eliminar pregunta", error);
            setError("No se pudo eliminar la pregunta. Intente nuevamente.");
        }
    };

    // Cargar pregunta en el formulario para edición
    const editarPregunta = (pregunta) => {
        setTexto(pregunta.texto);
        setPeso(pregunta.peso.toString());
        setEditando(pregunta.id);
    };

    return (
        <div className="preguntas-container">
            <h2 className="preguntas-header">Gestión de Preguntas</h2>
            
            {/* Formulario para agregar o editar */}
            <form onSubmit={manejarEnvio} className="preguntas-form">
                {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
                
                <input
                    type="text"
                    placeholder="Pregunta"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    aria-label="Texto de la pregunta"
                    required
                />
                <input
                    type="number"
                    placeholder="Peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    aria-label="Peso de la pregunta"
                    min="1"
                    required
                />
                <button type="submit">
                    {editando ? "Actualizar Pregunta" : "Agregar Pregunta"}
                </button>
            </form>

            {/* Lista de preguntas */}
            {preguntas.length === 0 ? (
                <p>No hay preguntas. Agregue una nueva.</p>
            ) : (
                <>
                    <div className="preguntas-list-header">
                        <div>#</div>
                        <div>Pregunta</div>
                        <div>Peso</div>
                        <div>Acciones</div>
                    </div>
                    <ul className="preguntas-list">
                        {preguntas.map((pregunta, index) => (
                            <li key={pregunta.id} className="preguntas-item">
                                <div className="preguntas-item-number">{index + 1}</div>
                                <div className="preguntas-item-text">{pregunta.texto}</div>
                                <div className="preguntas-item-peso">{pregunta.peso}</div>
                                <div className="preguntas-item-actions">
                                    <button 
                                        onClick={() => editarPregunta(pregunta)}
                                        className="btn-editar"
                                        aria-label={`Editar pregunta: ${pregunta.texto}`}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => eliminarPregunta(pregunta.id)}
                                        className="btn-eliminar"
                                        aria-label={`Eliminar pregunta: ${pregunta.texto}`}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Preguntas;