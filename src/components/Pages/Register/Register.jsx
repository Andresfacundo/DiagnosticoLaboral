import React, { useState } from 'react';
import './Register.css';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('asociado');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password, rol }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al registrar usuario');
            }

            setSuccess(data.msg);
            setTimeout(() => navigate('/login'), 2000); // Redirigir después de 2s
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="logo-register">
                    <div className="logo-icon-register"><FaUser /></div>
                </div>
                <div className='box-tittle-register'>
                    <h2>Crea una cuenta</h2>

                </div>


                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group-register">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            disabled={loading}
                        // placeholder='Escribe tu nombre'
                        />
                    </div>

                    <div className="input-group-register">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        // placeholder='Escribe tu correo'
                        />
                    </div>

                    <div className="input-group-register password-group-register">
                        <label htmlFor="password">Contraseña</label>
                        <div className="password-wrapper-register">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="toggle-password-register"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                            </button>
                        </div>
                    </div>

                    <div className="input-group-register password-group-register">
                        <label htmlFor="confirmarPassword">Confirmar contraseña</label>
                        <div className="password-wrapper-register">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmarPassword"
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="toggle-password-register"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <i className="fa-regular fa-eye-slash"></i>
                                ) : (
                                    <i className="fa-regular fa-eye"></i>
                                )}
                            </button>
                        </div>
                    </div>


                    <button type="submit" className="register-btn-register" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <p className="redirect-login">
                    ¿Ya tienes cuenta? <span onClick={() => navigate('/login')}>Inicia Sesión</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
