import { useState, useEffect } from "react";
import axios from "axios";
import './Preguntas.css'
import authService from "../../../Services/authService";
import flecha from '../../../../public/flecha.svg'
import configuracion from '../../../assets/configuraciones.svg'
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Preguntas = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [texto, setTexto] = useState("");
    const [peso, setPeso] = useState("");
    const [categoria, setCategoria] = useState("");
    const [editandoEnLinea, setEditandoEnLinea] = useState({});
    const [error, setError] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("Todas");
    const [mostrarFlecha, setMostrarFlecha] = useState(false);

    const tiposRespuestas = ["Si", "Parcialmente", "No", "No aplica"];

    const getAuthConfig = () => ({
        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
    });

    const calcularPesoTotal = () => {
        return preguntas.reduce((total, pregunta) => total + (pregunta.peso || 0), 0);
    };

    const manejarError = (error, mensajeDefault) => {
        console.error(mensajeDefault, error);
        if (error.response?.status === 401) {
            setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
            authService.logout();
        } else if (error.response?.status === 403) {
            setError('No tiene permisos para realizar esta acción.');
        } else {
            setError(mensajeDefault);
        }
    };

    // Cargar categorías al montar el componente
    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/categorias`, getAuthConfig());
                setCategorias(response.data);
            } catch (error) {
                manejarError(error, "No se pudieron cargar las categorías.");
            }
        };
        cargarCategorias();
    }, []);

    // Efecto para manejar scroll y mostrar flecha
    useEffect(() => {
        const handleScroll = () => {
            setMostrarFlecha(window.scrollY > 300 || preguntas.length > 5);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [preguntas.length]);

    // Cargar preguntas cuando cambia el filtro
    useEffect(() => {
        cargarPreguntas();
    }, [filtroCategoria]);

    const cargarPreguntas = async () => {
        try {
            const endpoint = filtroCategoria === "Todas"
                ? `${API_URL}/api/preguntas`
                : `${API_URL}/api/preguntas/categoria/${filtroCategoria}`;
            const response = await axios.get(endpoint, getAuthConfig());
            setPreguntas(response.data);
        } catch (error) {
            manejarError(error, "No se pudieron cargar las preguntas.");
        }
    };

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
        if (!categoria) {
            setError("Debe seleccionar una categoría");
            return;
        }
        try {
            await axios.post(`${API_URL}/api/preguntas`, {
                texto: texto.trim(),
                peso: Number(peso),
                categoria: categoria // Usamos el id de la categoría
            }, getAuthConfig());
            cargarPreguntas();
            setTexto("");
            setPeso("");
            setCategoria("");
        } catch (error) {
            manejarError(error, "No se pudo agregar la pregunta.");
        }
    };

    const eliminarPregunta = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/preguntas/${id}`, getAuthConfig());
            setPreguntas(preguntas.filter(p => p.id !== id));
        } catch (error) {
            manejarError(error, "No se pudo eliminar la pregunta.");
        }
    };

    const iniciarEdicionEnLinea = (pregunta) => {
        const categoriaId = pregunta.categoria;

        setEditandoEnLinea({
            id: pregunta.id,
            texto: pregunta.texto,
            peso: pregunta.peso.toString(),
            categoriaId: categoriaId,
            respuestas: Object.fromEntries(
                tiposRespuestas.map(tipo => [tipo, (pregunta.respuestas?.[tipo] ?? 0).toString()])
            )
        });
    };

    const cambiarCampoEdicion = (campo, valor) => {
        setEditandoEnLinea(prev => ({ ...prev, [campo]: valor }));
    };

    const cambiarValorRespuesta = (tipo, valor) => {
        setEditandoEnLinea(prev => ({
            ...prev,
            respuestas: { ...prev.respuestas, [tipo]: valor }
        }));
    };

    const guardarEdicionEnLinea = async (id) => {
        if (!editandoEnLinea.texto.trim()) {
            setError("El texto de la pregunta es obligatorio");
            return;
        }
        if (!editandoEnLinea.peso || isNaN(Number(editandoEnLinea.peso)) || Number(editandoEnLinea.peso) <= 0) {
            setError("El peso debe ser un número positivo");
            return;
        }
        if (!editandoEnLinea.categoriaId) {
            setError("Debe seleccionar una categoría");
            return;
        }
        for (const tipo of tiposRespuestas) {
            const valor = editandoEnLinea.respuestas[tipo];
            if (!valor.trim() || isNaN(Number(valor))) {
                setError(`El valor para "${tipo}" debe ser un número válido`);
                return;
            }
        }
        try {
            const respuestasNumero = Object.fromEntries(
                tiposRespuestas.map(tipo => [tipo, Number(editandoEnLinea.respuestas[tipo])])
            );
            const response = await axios.put(`${API_URL}/api/preguntas/${id}`, {
                texto: editandoEnLinea.texto.trim(),
                peso: Number(editandoEnLinea.peso),
                categoriaId: editandoEnLinea.categoriaId,
                respuestas: respuestasNumero
            }, getAuthConfig());
            setPreguntas(preguntas.map(p => p.id === id ? response.data : p));
            setEditandoEnLinea({});
            setError("");
        } catch (error) {
            manejarError(error, "No se pudo actualizar la pregunta.");
        }
    };

    const cancelarEdicionEnLinea = () => {
        setEditandoEnLinea({});
        setError("");
    };

    // Helper para obtener el nombre de la categoría por id
    const obtenerNombreCategoria = (pregunta) => {
        const categoriaId = pregunta.categoria

        const cat = categorias.find(c => c.id == categoriaId);
        return cat ? cat.nombre : 'No disponible';
    };

    return (
        <div id='navbar' className="preguntas-container">
            <div className="settings">
                <Link to='/questions/gestion-categorias'>
                    <img src={configuracion} alt="Configuración" />
                </Link>
            </div>

            <h2 className="preguntas-header">Gestión de Preguntas</h2>

            {/* Formulario para agregar preguntas */}
            <form onSubmit={manejarEnvio} className="preguntas-form">
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <input
                    type="text"
                    placeholder="Nueva Pregunta"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Peso (0-3)"
                    value={peso}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setPeso(e.target.value)}
                    min="0"
                    max='3'
                    step='any'
                    required
                />
                <select
                    className="select-categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                >
                    <option value="" disabled>Seleccione una categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
                <button type="submit">Agregar Nueva Pregunta</button>
            </form>

            {/* Filtro de categorías */}
            <div className="categoria-filter">
                <label htmlFor="filtro-categoria">Filtrar por categoría:</label>
                <select
                    id="filtro-categoria"
                    className="select-filtro-categoria"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                    <option value="Todas">Todas las categorías</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="preguntas-totales">
                <div className="total-box">
                    <span className="total-label">Preguntas</span>
                    <span className="total-value">{preguntas.length}</span>
                </div>
                <div className="total-box">
                    <span className="total-label">Peso total</span>
                    <span className="total-value">{calcularPesoTotal()}</span>
                </div>
            </div>

            {/* Lista de preguntas */}
            <div className="preguntas-list-container">
                {preguntas.length === 0 ? (
                    <p>No hay preguntas {filtroCategoria !== "Todas" ? `en la categoría seleccionada` : ""}. Agregue una nueva.</p>
                ) : (
                    <>
                        <div className="preguntas-list-header">
                            <div>#</div>
                            <div>Pregunta</div>
                            <div>Peso</div>
                            <div>Categoría</div>
                            <div>Acciones</div>
                        </div>
                        <ul className="preguntas-list">
                            {preguntas.map((pregunta, index) => (
                                <li key={pregunta.id} className="preguntas-item">
                                    <div className="gestionar-preguntas">
                                        <div className="preguntas-item-number">{index + 1}</div>
                                        {editandoEnLinea.id === pregunta.id ? (
                                            <>
                                                <div className="preguntas-item-text">
                                                    <input
                                                        type="text"
                                                        value={editandoEnLinea.texto}
                                                        onChange={(e) => cambiarCampoEdicion('texto', e.target.value)}
                                                        className="editar-en-linea-input"
                                                    />
                                                </div>
                                                <div className="preguntas-item-peso">
                                                    <input
                                                        type="number"
                                                        onWheel={(e) => e.target.blur()}
                                                        value={editandoEnLinea.peso}
                                                        onChange={(e) => cambiarCampoEdicion('peso', e.target.value)}
                                                        className="editar-en-linea-input peso"
                                                    />
                                                </div>
                                                <div className="preguntas-item-categoria">
                                                    <select
                                                        value={editandoEnLinea.categoriaId}
                                                        onChange={(e) => cambiarCampoEdicion('categoriaId', e.target.value)}
                                                        className="editar-en-linea-input"
                                                    >
                                                        {categorias.map((cat) => (
                                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="preguntas-item-actions">
                                                    <button
                                                        onClick={() => guardarEdicionEnLinea(pregunta.id)}
                                                        className="btn-guardar"
                                                    >
                                                        Guardar
                                                    </button>
                                                    <button
                                                        onClick={cancelarEdicionEnLinea}
                                                        className="btn-cancelar"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            // Modo visualización - CORREGIDO: cambié pregunta.nombre por pregunta.categoriaId
                                            <>
                                                <div className="preguntas-item-text">{pregunta.texto}</div>
                                                <div className="preguntas-item-peso">{pregunta.peso}</div>
                                                <div className="preguntas-item-categoria">{obtenerNombreCategoria(pregunta)}</div>
                                                <div className="preguntas-item-actions">
                                                    <button
                                                        onClick={() => iniciarEdicionEnLinea(pregunta)}
                                                        className="btn-editar"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => eliminarPregunta(pregunta.id)}
                                                        className="btn-eliminar"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {/* Opciones de respuesta */}
                                    <div className="content-response">
                                        <p>Opciones de respuestas</p>
                                        <div className="content-response-items">
                                            {editandoEnLinea.id === pregunta.id ? (
                                                tiposRespuestas.map((tipo) => (
                                                    <div key={tipo} className={`respuesta ${tipo.toLowerCase().replace(" ", "-")}`}>
                                                        {tipo} <br />
                                                        <input
                                                            type="text"
                                                            value={editandoEnLinea.respuestas[tipo]}
                                                            onChange={(e) => cambiarValorRespuesta(tipo, e.target.value)}
                                                            className="editar-en-linea-input respuesta-input"
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="respuesta-container">
                                                    <div className="respuesta si">Si <br /> {pregunta.respuestas?.Si}</div>
                                                    <div className="respuesta si-parcialmente">Parcialmente <br /> {pregunta.respuestas?.["Parcialmente"]}</div>
                                                    <div className="respuesta no">No <br /> {pregunta.respuestas?.No}</div>
                                                    <div className="respuesta na">No aplica <br /> {pregunta.respuestas?.["No aplica"]}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            {/* Botón volver arriba */}
            {mostrarFlecha && (
                <a className='volver-home' href="#navbar">
                    <img src={flecha} alt="Volver arriba" />
                </a>
            )}
        </div>
    );
};

export default Preguntas;