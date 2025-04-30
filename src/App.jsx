import './App.css'
import { Routes,Route } from 'react-router-dom'
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

function App() {

  return (
    <>
    {/* <Logo/> */}
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
    </Routes>
    <Footer/>        
    </>
  )
}

export default App
