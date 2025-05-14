import React from 'react';
import './ComparativeGraph.css';

const ComparativeGraph = ({ selectedActual, selectProyections }) => {
  // Extraer todos los valores relevantes
  const employerActual = selectedActual?.proyecciones?.costoTotalEmpleador || 0;
  const employerProjected = selectProyections?.proyecciones?.costoTotalEmpleador || 0;
  const workerActual = selectedActual?.proyecciones?.pagoNetoTrabajador || 0;
  const workerProjected = selectProyections?.proyecciones?.pagoNetoTrabajador || 0;
  
  // Encontrar el valor máximo entre todos para mantener la escala proporcional
  const maxValue = Math.max(employerActual, employerProjected, workerActual, workerProjected, 1); // Evitar división por cero
  
  const calculatePercentageDifference = (type) => {
    if (!selectedActual || !selectProyections) return "-0.00%";
    
    const key = type === 'employer' ? 'costoTotalEmpleador' : 'pagoNetoTrabajador';
    const valorAnterior = employerProjected; // Valor proyectado
    const valorActual = employerActual; // Valor actual
    
    if (valorAnterior === 0) return "-0.00%";
    
    const diferencia = (((valorActual - valorAnterior)/valorAnterior) * 100).toFixed(2);
    return diferencia >= 0 ? `+${diferencia}%` : `${diferencia}%`;
  };
  
  // Format currency values (para pesos argentinos o la moneda que uses)
  const formatCurrency = (value) => {
    return `$ ${value.toLocaleString('es-AR')}`;
  };
  
  // Calculate bar heights (max 200px para barras más altas)
  const getBarHeight = (value) => {
    if (value === 0) return 20; // Altura mínima para visualización
    return Math.max(40, Math.min(200, (value / maxValue) * 200));
  };
  
  // Calcular alturas de barras proporcionales al valor máximo global
  const employerActualHeight = getBarHeight(employerActual);
  const employerProjectedHeight = getBarHeight(employerProjected);
  const workerActualHeight = getBarHeight(workerActual);
  const workerProjectedHeight = getBarHeight(workerProjected);
  
  // Para la barra de diferencia
  const diffPercentage = calculatePercentageDifference('employer');
  
  return (
    <div className="grafic-diferent">
      <div className="graph-container">
        {/* Employer Actual */}
        <div className="graph-column">
          <div className="column-title">Empleador</div>
          <div 
            className="bar-actual"
            style={{ height: `${employerActualHeight}px` }}
          />
          <div className="value-text">{formatCurrency(employerActual)}</div>
          <div className="label-text">Actual</div>
        </div>
        
        {/* Employer Projected */}
        <div className="graph-column">
          <div className="column-title">Empleador</div>
          <div 
            className="bar-projected"
            style={{ height: `${employerProjectedHeight}px` }}
          />
          <div className="value-text">{formatCurrency(employerProjected)}</div>
          <div className="label-text">Proyectado</div>
        </div>
        
        {/* Worker Actual */}
        <div className="graph-column">
          <div className="column-title">Trabajador</div>
          <div 
            className="bar-actual"
            style={{ height: `${workerActualHeight}px` }}
          />
          <div className="value-text">{formatCurrency(workerActual)}</div>
          <div className="label-text">Actual</div>
        </div>
        
        {/* Worker Projected */}
        <div className="graph-column">
          <div className="column-title">Trabajador</div>
          <div 
            className="bar-projected"
            style={{ height: `${workerProjectedHeight}px` }}
          />
          <div className="value-text">{formatCurrency(workerProjected)}</div>
          <div className="label-text">Proyectado</div>
        </div>
        
        {/* Difference */}
        <div className="graph-column">
          <div className="column-title">Diferencia</div>
          <div 
            className="bar-difference"
            style={{ height: `40px` }}
          >
            {diffPercentage}
          </div>
          <div className="value-text">{diffPercentage}</div>
          <div className="label-text">Aumento</div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeGraph;