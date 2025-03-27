import { useState, useEffect } from "react";
import axios from "axios";
import './Preguntas.css'

const Preguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [texto, setTexto] = useState("");
    const [peso, setPeso] = useState("");
    const [editando, setEditando] = useState(null); // ID de la pregunta en edición

    // Obtener preguntas desde el backend
    useEffect(() => {
        axios.get("http://localhost:3000/preguntas")
            .then(response => setPreguntas(response.data))
            .catch(error => console.error("Error al obtener preguntas", error));
    }, []);

    // Agregar o editar una pregunta
    const manejarEnvio = (e) => {
        e.preventDefault();

        if (!texto || !peso) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const nuevaPregunta = { texto, peso: Number(peso) };

        if (editando) {
            // Editar pregunta existente
            axios.put(`http://localhost:3000/preguntas/${editando}`, nuevaPregunta)
                .then(response => {
                    setPreguntas(preguntas.map(p => p.id === editando ? response.data : p));
                    setEditando(null);
                })
                .catch(error => console.error("Error al editar la pregunta", error));
        } else {
            // Agregar nueva pregunta
            axios.post("http://localhost:3000/preguntas", nuevaPregunta)
                .then(response => setPreguntas([...preguntas, response.data]))
                .catch(error => console.error("Error al agregar pregunta", error));
        }

        setTexto("");
        setPeso("");
    };

    // Eliminar una pregunta
    const eliminarPregunta = (id) => {
        axios.delete(`http://localhost:3000/preguntas/${id}`)
            .then(() => setPreguntas(preguntas.filter(p => p.id !== id)))
            .catch(error => console.error("Error al eliminar pregunta", error));
    };

    // Cargar pregunta en el formulario para edición
    const editarPregunta = (pregunta) => {
        setTexto(pregunta.texto);
        setPeso(pregunta.peso);
        setEditando(pregunta.id);
    };

    return (
        <div>
            <h2>Gestión de Preguntas</h2>
            
            {/* Formulario para agregar o editar */}
            <form onSubmit={manejarEnvio}>
                <input
                    type="text"
                    placeholder="Texto de la pregunta"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                />
                <button type="submit">{editando ? "Actualizar" : "Agregar"}</button>
            </form>

            {/* Lista de preguntas */}
            <ul>
                {preguntas.map((pregunta) => (
                    <li key={pregunta.id}>
                        {pregunta.texto} - Peso: {pregunta.peso}
                        <button onClick={() => editarPregunta(pregunta)}>Editar</button>
                        <button onClick={() => eliminarPregunta(pregunta.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Preguntas;
