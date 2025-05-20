import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "../CustomToolTip/CustomToolTip";
import './RadarChartComponent.css'

const RadarChartComponent = ({ categorias }) => {
  const data = categorias;

  return (
    <div className="radar-chart-responsive-container">
      <ResponsiveContainer width="100%" aspect={1.6}>
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="70%"
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
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;