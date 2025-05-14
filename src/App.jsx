import './App.css'
import { Routes,Route, useNavigate } from 'react-router-dom'
import Resultados from './components/Pages/Resultados/Resultados.jsx'
import Preguntas from './components/Pages/Preguntas/Preguntas.jsx'
import Formulario from './components/Pages/Formulario/Formulario.jsx'
import Home from './components/Pages/Home/Home.jsx'
import Cuestionario from './components/Pages/Cuestionario/Cuestionario.jsx'
import Navbar from './components/Ui/Navbar/Navbar.jsx'
import Login from './components/Ui/Login/Login.jsx'
import Footer from './components/Layouts/Footer/Footer.jsx'
import InfoDiagnostico from './components/Ui/InfoDiagnostico/InfoDiagnostico.jsx'
import AboutDiagnosis from './components/Ui/AboutDiagnosis/AboutDiagnosis.jsx'
import Registros from './components/Ui/Registros/Registros.jsx'
import { isTokenExpired } from './utils/valiteExpiration.js'
import { useEffect } from 'react'
import LoggingOut from './components/Ui/LogoutAutomatico/LoggingOut.jsx'
import NotFound from "./components/UI/NotFound/NotFound";

function App() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      navigate('/cerrando-sesion');
    };

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if(token && isTokenExpired(token)) {
        localStorage.removeItem('token');
        navigate('/cerrando-sesion');
      }
    }, 60000); // minuto
    return () => clearInterval(interval);

  },[navigate]);
  return (
    
    <>
    
    <Navbar id='navbar'/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='questions' element={<Preguntas/>}/>
      <Route path='diagnostico/form' element={<Formulario />}/>
      <Route path='resultados' element={<Resultados/>}/>
      <Route path='cuestionario' element={<Cuestionario/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='diagnostico' element={<InfoDiagnostico/>}/>
      <Route path='nosotros' element={<AboutDiagnosis/>}/>
      <Route path='historial' element={<Registros/>}/>
      <Route path="/cerrando-sesion" element={<LoggingOut />} />
      <Route path="*" Component={NotFound}/>

    </Routes>
    <Footer id='footer'/>        
    </>
  )
}

export default App