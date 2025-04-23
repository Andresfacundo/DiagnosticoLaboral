import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { subject, A, preguntas } = payload[0].payload; // Extraer datos del payload
    return (
      <div className="custom-tooltip" style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc" }}>
        <p><strong>{subject}</strong></p>
        <p>Cumplimiento: {A}%</p>
        <p>Preguntas: {preguntas}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;