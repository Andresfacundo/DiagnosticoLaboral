import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
const API_URL = import.meta.env.VITE_API_URL
import authService from '../../../Services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Hook para navegación

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.msg || 'Error al iniciar sesión');
      }
  
      // Guardar token y datos del usuario con authService
      authService.login(data.token, data.usuario);
  
      if (rememberMe) {
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('userEmail');
      }
  
      // Redirigir según rol
      switch (data.usuario.rol) {
        case 'superadmin':
        case 'admin':
          navigate('/questions');
          break;
        case 'user':
          navigate('/diagnostico');
          break;
        default:
          navigate('/dashboard');
      }
  
    } catch (error) {
      console.error('Error de autenticación:', error);
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar email recordado al iniciar
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo">
          <div className="logo-icon"><FaUser /></div>
        </div>
        <h1>Iniciar Sesión</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Ingresa tu correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Ingresa tu contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading}
            />
          </div>
          <div className="remember-forgot">
            <div className="remember">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="remember">Recordarme</label>
            </div>
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;