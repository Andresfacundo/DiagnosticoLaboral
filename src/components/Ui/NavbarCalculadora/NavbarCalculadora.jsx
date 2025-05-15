import React from "react";
import Calculadora from "../../../assets/calculator-line.png";
import Comparar from "../../../assets/arrow-left-right-line.png";
import Resultado from "../../../assets/Chart Vertical.png";
import "./Navbar.css";
import BotonCalculadora from "../../UI/BotonCalculadora/BotonCalculadora";

const Navbar = () => {
  return (
    <>
      <BotonCalculadora
        route="/form/calculadora"
        styleB="boxButton"
        className="boton"
        img={Calculadora}   
        content="Formulario"
      />
      <BotonCalculadora
        styleB="boxButton"
        className="boton"
        img={Resultado}
        content="Resultados"
        route="/Resultados/calculadora"
      />
      <BotonCalculadora 
        route="/Comparar"
        styleB="boxButton testing"
        className="boton"
        img={Comparar}
        content="Comparar"
      />
    </>
  );
};

export default Navbar;
