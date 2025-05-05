import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";
import CustomTooltip from "../CustomToolTip/CustomToolTip";

const RadarChartComponent = ({ categorias }) => {
  const data = categorias;

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
        name="Cumplimiento"
        dataKey="A"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.6}
      />
      <Tooltip content={<CustomTooltip/>}/>
    </RadarChart>
  );
};

export default RadarChartComponent;