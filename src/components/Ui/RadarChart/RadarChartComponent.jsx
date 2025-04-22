import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";

const RadarChartComponent = ({ categorias }) => {
  // Datos de ejemplo
  const data = [
    { subject: "Comunicación", A: 80, fullMark: 100 },
    { subject: "Trabajo en equipo", A: 50, fullMark: 100 },
    { subject: "Liderazgo", A: 70, fullMark: 100 },
    { subject: "Adaptabilidad", A: 100, fullMark: 100 },
    { subject: "Resolución de problemas", A: 30, fullMark: 100 },
  ];

  return (
    <RadarChart
      cx={300}
      cy={250}
      outerRadius={140}
      width={600}
      height={500}
      data={data}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis />
      <Radar
        name="Empleado A"
        dataKey="A"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.6}
      />
      <Tooltip />
    </RadarChart>
  );
};

export default RadarChartComponent;