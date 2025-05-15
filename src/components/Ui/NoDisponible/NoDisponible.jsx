import React from "react";
import NavbarCalculadora from "../NavbarCalculadora/NavbarCalculadora";
import "./NoDisponible.css";

const NoDisponible = () => {
  return (
    <div className="not-content-result">      
        <div className="content-navbar">
          <NavbarCalculadora />
        </div>
        <div className="boxTittle"> 
          <h3>Resultados No disponibles</h3>
        </div>
    </div>
  );
};

export default NoDisponible;
