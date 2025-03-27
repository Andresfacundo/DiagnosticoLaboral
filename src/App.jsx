import './App.css'
import { Routes,Route } from 'react-router-dom'

import Diagnostico from './components/Pages/Diagnostico/Diagnostico'
import Logo from './components/Ui/Logo/Logo.jsx'
import Preguntas from './components/Pages/Preguntas/Preguntas.jsx'
import Formulario from './components/Pages/Formulario/Formulario.jsx'
import Home from './components/Pages/Home/Home.jsx'




function App() {

  return (
    <>
    <Logo/>
    <Home/>

    <Routes>
      <Route path='preguntas' element={<Preguntas/>}/>
      <Route path='formulario' element={<Formulario/>}/>
      <Route path='diagnostico' element={<Diagnostico/>}/>
    </Routes>
     
    </>
  )
}

export default App
