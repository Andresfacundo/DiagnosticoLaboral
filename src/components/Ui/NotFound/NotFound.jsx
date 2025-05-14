import React from 'react'
import './NotFound.css'
import Boton from '../Boton/Boton';
import inicio from '../../../assets/inicio.png'




const NotFound = () => {

  return (
    <div className="container-notFound">
      <div className="items">
        <h1>404</h1>
        <div className="item-notFound">
          <h2 >
            Página no Encontrada...
          </h2>
          <p >
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        <div className="item-button">
          <Boton styleB="boxButton" className="boton" img={inicio} content="Ir al inicio" route="/"/>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
