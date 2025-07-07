import React, { useEffect, useState } from "react";
import "./SpinnerTimed.css";

const SpinnerTimed = ({ mensaje = "Cargando...", onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="spinner-timed-container">
      <div className="spinner"></div>
      <p>{mensaje}</p>
    </div>
  );
};

export default SpinnerTimed;