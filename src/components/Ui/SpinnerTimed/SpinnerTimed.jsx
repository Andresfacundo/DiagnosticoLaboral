import React, { useEffect, useState } from "react";
import "./SpinnerTimed.css";

const SpinnerTimed = ({ mensaje = "Cargando..." }) => {
  return (
    <div className="spinner-timed-container">
      <div className="spinner"></div>
      <p>{mensaje}</p>
    </div>
  );
};

export default SpinnerTimed;