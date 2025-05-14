import React from "react";
import Navbar from "../NavbarCalculadora/Navbar";
import "./NotAvaible.css";

const NotAvaible = () => {
  return (
    <div className="not-content-result">
      <h1>Resultados</h1>
        <div className="content-navbar">
          <Navbar />
        </div>
        <div className="boxTittle"> 
          <h3>Resultados No disponibles</h3>
        </div>
    </div>
  );
};

export default NotAvaible;
