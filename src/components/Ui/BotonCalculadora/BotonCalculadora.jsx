import React from "react";
import { NavLink } from "react-router-dom";

const BotonCalculadora = ({ styleB, content, className, route, img }) => {
  return (
    <div className={styleB}>
      <NavLink to={route} className={className}><img src={img} alt="icono" />{content}</NavLink>
    </div>
  );
};

export default BotonCalculadora;
