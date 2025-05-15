import React from 'react';
import './ResumenComparativo.css';
import formatCurrency from '../../../utils/formatUtils';
 


// selectedActual

const ResumenComparativo = ({ selectedActual, selectProyections }) => {
  // Extraer todos los valores relevantes
  const employerActual = selectedActual?.proyecciones?.costoTotalEmpleador || 0;
  const employerProjected = selectProyections?.proyecciones?.costoTotalEmpleador || 0;
  const workerActual = selectedActual?.proyecciones?.pagoNetoTrabajador || 0;
  const workerProjected = selectProyections?.proyecciones?.pagoNetoTrabajador || 0;
  
  // Calcular diferencias y porcentajes
  const calcularDiferencia = (valorActual, valorProyectado) => {
    const diferencia = valorActual - valorProyectado;
    return diferencia >= 0 ? `+ ${formatCurrency(diferencia)}` : `- ${formatCurrency(Math.abs(diferencia))}`;
  };
  
  const calcularPorcentaje = (valorActual, valorProyectado) => {
    if (valorProyectado === 0) return "+0%";
    const porcentaje = (((valorActual - valorProyectado) / valorProyectado) * 100).toFixed(1);
    return porcentaje >= 0 ? `+ ${porcentaje}%` : `- ${Math.abs(porcentaje)}%`;
  };
  
  // Encontrar el valor máximo entre todos para mantener la escala proporcional
  const maxValue = Math.max(employerActual, employerProjected, workerActual, workerProjected, 1);
  
  // Format currency values
  // const formatCurrency = (value) => {
  //   return `$${value.toLocaleString('es-AR')}`;
  // };
  
  // Calculate bar heights (max 150px)
  const getBarHeight = (value) => {
    if (value === 0) return 20; // Altura mínima para visualización
    return Math.max(40, Math.min(150, (value / maxValue) * 150));
  };
  
  // Calcular alturas de barras proporcionales al valor máximo global
  const employerActualHeight = getBarHeight(employerActual);
  const employerProjectedHeight = getBarHeight(employerProjected);
  const workerActualHeight = getBarHeight(workerActual);
  const workerProjectedHeight = getBarHeight(workerProjected);
  
  // Calcular diferencia porcentual para la barra de diferencia
  const diffPercentaje = calcularPorcentaje(employerActual, employerProjected);
  const sobreCostoActual = employerActual - workerActual;
  const sobreCostoProyectado = employerProjected - workerProjected;


  return (
    <div className="resumen-comparativo-container">
      <h2 className="resumen-title">Resumen Comparativo</h2>
      
      {/* Tarjetas de Resumen */}
      <div className="resumen-cards">
        {/* Tarjeta de Costo Total Empleador */}
        <div className="resumen-card employer-card">
          <h3 className="card-title">Actual</h3>
          <div className="card-content">
            <div className="card-column"> 
              <div className="column-header">Costo total</div>
              <div className={`column-value ${employerActual < 0 ? 'negative' : ''}`}>{formatCurrency(employerActual)}</div>
              <div className={`column-diff ${employerActual - employerProjected < 0 ? 'negative' : ''}`}>{calcularDiferencia(employerActual, employerProjected)}</div>
              <div className={`column-percentage ${employerActual - employerProjected < 0 ? 'negative' : ''}`}>{calcularPorcentaje(employerActual, employerProjected)}</div>
            </div>
            <div className="card-column">
              <div className="column-header">Pago neto</div>
              <div className={`column-value ${workerActual < 0 ? 'negative' : ''}`}>{formatCurrency(workerActual)}</div>
              <div className={`column-diff ${workerActual - workerProjected   < 0 ? 'negative' : ''}`}>{calcularDiferencia(workerActual,workerProjected )}</div>
              <div className={`column-percentage ${workerActual - workerProjected   < 0 ? 'negative' : ''}`}>{calcularPorcentaje(workerActual,workerProjected  )}</div>
            </div>
          </div>
            <div className='card-everrun'>
              <p>Sobre costo {formatCurrency(sobreCostoActual)}</p>    
            </div>
        </div>
        
        {/* Tarjeta de Pago Neto Trabajador */}
        <div className="resumen-card worker-card">
          <h3 className="card-title">Proyectado</h3>
          <div className="card-content">
            <div className="card-column">
              <div className="column-header">Costo total</div>
              <div className={`column-value ${employerProjected < 0 ? 'negative' : ''}`}>{formatCurrency(employerProjected)}</div>
              <div className={`column-diff ${employerProjected - employerActual  < 0 ? 'negative' : ''}`}>{calcularDiferencia(employerProjected,employerActual)}</div>
              <div className={`column-percentage ${ employerProjected - employerActual < 0 ? 'negative' : ''}`}>{calcularPorcentaje(employerProjected,employerActual)}</div>
            </div>
            <div className="card-column">
              <div className="column-header">Pago neto</div>
              <div className={`column-value ${workerProjected < 0 ? 'negative' : ''}`}>{formatCurrency(workerProjected)}</div>
              <div className={`column-diff ${workerProjected - workerActual < 0 ? 'negative' : ''}`}>{calcularDiferencia(workerProjected, workerActual)}</div>
              <div className={`column-percentage ${workerProjected - workerActual < 0 ? 'negative' : ''}`}>{calcularPorcentaje(workerProjected, workerActual)}</div>
            </div>
          </div>
          <div className='card-everrun'>
              <p>Sobre costo {formatCurrency(sobreCostoProyectado)}</p>    
            </div>
        </div>
      </div>
      
      {/* Gráfico Comparativo */}
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
          {/* <div className="graph-column">
            <div className="column-title">Diferencia</div>
            <div 
              className={`bar-difference ${parseFloat(diffPercentaje) < 0 ? 'negative' : ''}`}
              style={{ height: `40px` }}
            >
              {diffPercentaje}
            </div>
            <div className={`value-text ${parseFloat(diffPercentaje) < 0 ? 'negative' : ''}`}>{diffPercentaje}</div>
            <div className="label-text">Aumento</div>
          </div> */}
        </div>
      </div>

    </div>
  );
};

export default ResumenComparativo;