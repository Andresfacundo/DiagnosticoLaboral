import './App.css'
import { Routes,Route } from 'react-router-dom'
import Diagnostico from './components/Pages/Diagnostico/Diagnostico'
import Logo from './components/Ui/Logo/Logo.jsx'
import Preguntas from './components/Pages/Preguntas/Preguntas.jsx'
import Formulario from './components/Pages/Formulario/Formulario.jsx'
import Home from './components/Pages/Home/Home.jsx'
import Cuestionario from './components/Pages/Cuestionario/Cuestionario.jsx'
import Navbar from './components/Ui/Navbar/Navbar.jsx'
// import Resultados from './components/Pages/Resultados/Resultados.jsx'





function App() {



  return (
    <>
    {/* <Logo/> */}
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='questions' element={<Preguntas/>}/>
      <Route path='form' element={<Formulario />}/>
      <Route path='diagnostico' element={<Diagnostico/>}/>
      <Route path='cuestionario' element={<Cuestionario/>}/>
      {/* <Route path='resultados' element={<Resultados/>}/> */}
    </Routes>
    </>
  )
}

export default App
