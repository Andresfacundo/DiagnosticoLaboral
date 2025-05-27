import { useState, useEffect } from "react";
import axios from "axios";
import authService from "../../../Services/authService";
import './CategoriasRecomendaciones.css';
import { NavLink } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CategoriasRecomendaciones = () => {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [recomendacion, setRecomendacion] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [modoEdicion, setModoEdicion] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [editandoRecomendacion, setEditandoRecomendacion] = useState(null);
    const [nuevoTextoRecomendacion, setNuevoTextoRecomendacion] = useState("");

    const getAuthConfig = () => {
        const token = authService.getToken();
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    const cargarCategorias = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/categorias`, getAuthConfig());
            setCategorias(response.data);
        } catch {
            setError("No se pudieron cargar las categorías.");
        }
    };

    const cargarRecomendaciones = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/recomendaciones`, getAuthConfig());
            setRecomendaciones(response.data);
        } catch {
            setError("Error al cargar recomendaciones.");
        }
    };

    useEffect(() => {
        cargarCategorias();
        cargarRecomendaciones();
    }, []);

    const agregarCategoria = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");
        if (!nuevaCategoria.trim()) return setError("El nombre de la categoría es obligatorio");
        try {
            await axios.post(`${API_URL}/api/categorias`, { nombre: nuevaCategoria.trim() }, getAuthConfig());
            setNuevaCategoria("");
            setMensaje("Categoría agregada correctamente");            
            cargarCategorias();
        } catch {
            setError("No se pudo agregar la categoría.");
        }
    };

    const agregarRecomendacion = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");
        if (!recomendacion.trim() || !categoriaSeleccionada) {
            return setError("Debe seleccionar una categoría y escribir la recomendación");
        }
        try {
            await axios.post(`${API_URL}/api/${categoriaSeleccionada}/recomendaciones`, {
                texto: recomendacion.trim(),
                categoriaId: categoriaSeleccionada
            }, getAuthConfig());
            setRecomendacion("");
            setMensaje("Recomendación agregada correctamente");
            cargarRecomendaciones();
        } catch {
            setError("No se pudo agregar la recomendación.");
        }
    };

    const editarCategoria = async (id) => {
        try {
            await axios.put(`${API_URL}/api/categorias/${id}`, { nombre: nuevoNombre }, getAuthConfig());
            setModoEdicion(null);
            setNuevoNombre("");
            cargarCategorias();
        } catch {
            setError("No se pudo editar la categoría.");
        }
    };

    const eliminarCategoria = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/categorias/${id}`, getAuthConfig());
            cargarCategorias();
        } catch {
            setError("No se pudo eliminar la categoría.");
        }
    };

    const editarRecomendacion = async (id) => {
        try {
            await axios.put(`${API_URL}/api/recomendaciones/${id}`, {
                texto: nuevoTextoRecomendacion
            }, getAuthConfig());
            setEditandoRecomendacion(null);
            setNuevoTextoRecomendacion("");
            cargarRecomendaciones();
        } catch {
            setError("No se pudo editar la recomendación.");
        }
    };

    const eliminarRecomendacion = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/recomendaciones/${id}`, getAuthConfig());
            cargarRecomendaciones();
        } catch {
            setError("No se pudo eliminar la recomendación.");
        }
    };

    return (
        <div className="categorias-recomendaciones-container">
            <h2>Gestión de Categorías y Recomendaciones</h2>
            {mensaje && <div className="mensaje">{mensaje}</div>}
            {error && <div className="error">{error}</div>}

            <form onSubmit={agregarCategoria} className="formulario">
                <input
                    type="text"
                    placeholder="Nueva categoría"
                    value={nuevaCategoria}
                    onChange={e => setNuevaCategoria(e.target.value)}
                />
                <button type="submit">Agregar Categoría</button>
            </form>

            <form onSubmit={agregarRecomendacion} className="formulario">
                <select
                    value={categoriaSeleccionada}
                    onChange={e => setCategoriaSeleccionada(e.target.value)}
                >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
                <textarea
                    type="text"
                    placeholder="Recomendación"
                    value={recomendacion}
                    onChange={e => setRecomendacion(e.target.value)}
                />
                <button type="submit">Agregar Recomendación</button>
            </form>

            <div className="listas">
                <div className="lista">
                    <h3>Categorías</h3>
                    {categorias.map(cat => (
                        <div key={cat.id} className="item">
                            {modoEdicion === cat.id ? (
                                <>
                                    <input value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} />
                                    <button onClick={() => editarCategoria(cat.id)}>Guardar</button>
                                    <button onClick={() => setModoEdicion(null)}>Cancelar</button>
                                </>
                            ) : (
                                <>
                                    <span>{cat.nombre}</span>
                                    <button onClick={() => {
                                        setModoEdicion(cat.id);
                                        setNuevoNombre(cat.nombre);
                                    }}>Editar</button>
                                    <button onClick={() => eliminarCategoria(cat.id)}>Eliminar</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="lista">
                    <h3>Recomendaciones</h3>
                    {recomendaciones.map(rec => (
                        <div key={rec.id} className="item">
                            {editandoRecomendacion === rec.id ? (
                                <>
                                    <textarea
                                        value={nuevoTextoRecomendacion}
                                        onChange={e => setNuevoTextoRecomendacion(e.target.value)}
                                    />
                                    <button onClick={() => editarRecomendacion(rec.id)}>Guardar</button>
                                    <button onClick={() => setEditandoRecomendacion(null)}>Cancelar</button>
                                </>
                            ) : (
                                <>
                                    <span>{rec.texto} ({categorias.find(c => c.id === rec.id)?.nombre})</span>
                                    <button onClick={() => {
                                        setEditandoRecomendacion(rec.id);
                                        setNuevoTextoRecomendacion(rec.texto);
                                    }}>Editar</button>
                                    <button onClick={() => eliminarRecomendacion(rec.id)}>Eliminar</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriasRecomendaciones;
