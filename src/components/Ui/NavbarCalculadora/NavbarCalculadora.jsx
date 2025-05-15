import React from "react";
import Boton from "../Boton/Boton.jsx";
import Calculadora from "../../../assets/calculator-line.png";
import Comparar from "../../../assets/arrow-left-right-line.png";
import Resultado from "../../../assets/Chart Vertical.png";
import "./NavbarCalculadora.css";

const NavbarCalculadora = () => {
  return (
    <>
      <Boton
        route="/form/calculadora"
        styleB="boxButton"
        className="boton"
        img={Calculadora}
        content="Formulario"
      />
      <Boton
        styleB="boxButton"
        className="boton"
        img={Resultado}
        content="Resultados"
        route="/Resultados/calculadora"
      />
      <Boton 
        route="/Comparar"
        styleB="boxButton testing"
        className="boton"
        img={Comparar}
        content="Comparar"
      />
    </>
  );
};

export default NavbarCalculadora;
