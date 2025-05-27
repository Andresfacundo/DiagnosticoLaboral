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
import Cargando from './components/Ui/Cargando/Cargando.jsx'



import FormularioCalculadora from './components/Pages/FormularioCalculadora/FormularioCalculadora.jsx'
import ResultadosCalculadora from './components/Pages/ResultadosCalculadora/ResultadosCalculadora.jsx'
import Comparar from './components/Pages/Comparar/Comparar.jsx'
import NotFound from './components/Ui/NotFound/NotFound.jsx'
import NoDisponible from './components/Ui/NoDisponible/NoDisponible.jsx'
import EditarConstantes from './components/Ui/EditarConstantes.jsx/EditarConstantes.jsx'
import TerminosCondiciones from './components/Pages/TerminosCondiciones/TerminosCondiciones.jsx'
import CategoriasRecomendaciones from './components/Pages/CategoriasRecomendaciones/CategoriasRecomendaciones.jsx'

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
      <Route path='/areas-servicio' element={<Home/>}/>
      <Route path='questions' element={<Preguntas/>}/>
      <Route path='diagnostico/form' element={<Formulario />}/>
      <Route path='resultados' element={<Resultados/>}/>
      <Route path='cuestionario' element={<Cuestionario/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='/' element={<InfoDiagnostico/>}/>
      <Route path='nosotros' element={<AboutDiagnosis/>}/>
      <Route path='historial' element={<Registros/>}/>
      <Route path="/cerrando-sesion" element={<LoggingOut />} />
      <Route path="/cargando" element={<Cargando />} />
      <Route path="/politica-datos" element={<TerminosCondiciones />} />
      <Route path="/questions/gestion-categorias" element={<CategoriasRecomendaciones />} />



      <Route path="/form/calculadora" element={<FormularioCalculadora/>} />
      <Route path="/form/configuracion" element={<EditarConstantes/>} />

      <Route path="Resultados/calculadora" element={<ResultadosCalculadora/>} />
      <Route path="Comparar" element={<Comparar/>}/>
      <Route path="*" element={<NotFound/>}/>
      <Route path="NoDisponible" element={<NoDisponible/>}/>

    </Routes>
    <Footer id='footer'/>        
    </>
  )
}

export default App