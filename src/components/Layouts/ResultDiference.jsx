import React from 'react';
import ParrafosCalculadora from '../Ui/ParrafosCalculadora/ParrafosCalculadora';
import formatCurrency from '../../utils/formatUtils';
import './ResultDiference.css'


const ResultDiference = ({ selectedActual, selectProyections }) => {
  const calcularDiferencia = (content1, key) => {
    if (selectedActual && selectProyections) {
      const diferencia =
      (selectProyections?.[content1]?.[key] || 0)-
        (selectedActual?.[content1]?.[key] || 0) ;

      return diferencia >= 0
        ? `+ ${formatCurrency(diferencia)}`
        : `- ${formatCurrency(Math.abs(diferencia))}`;
    }
    return "+$0";
  };

  return (
    <div className=''>
      <h2>Empleador</h2>
      <div className='content-tittle'>
        <h3>Concepto</h3>
        <h3>Actual</h3>
        <h3>Proyectado</h3>
        <h3>Diferencia</h3>
      </div>
      <div className='content-difference'>
        <div className='concept'>
          <div className='result-concept'>
            <p>Provisiones</p>
            <ParrafosCalculadora results={selectedActual} content1="proyecciones" content2="provisionesPrestacionesSociales" />
            <ParrafosCalculadora results={selectProyections} content1="proyecciones" content2="provisionesPrestacionesSociales" />
            <ParrafosCalculadora results={calcularDiferencia("proyecciones", "provisionesPrestacionesSociales")} />
          </div>
          <div className='result-concept'>
            <p>Aportes</p>
            <ParrafosCalculadora results={selectedActual} content1="proyecciones" content2="aportesEmpleador" />
            <ParrafosCalculadora results={selectProyections} content1="proyecciones" content2="aportesEmpleador" />
            <ParrafosCalculadora results={calcularDiferencia("proyecciones", "aportesEmpleador")} />
          </div>
          <div className='result-concept'>
            <p>Pago Neto</p>
            <ParrafosCalculadora results={selectedActual} content1="proyecciones" content2="pagoNetoTrabajador" />
            <ParrafosCalculadora results={selectProyections} content1="proyecciones" content2="pagoNetoTrabajador" />
            <ParrafosCalculadora results={calcularDiferencia("proyecciones", "pagoNetoTrabajador")} />
          </div>
          <div className='result-concept'>
            <p>Total a pagar</p>
            <ParrafosCalculadora results={selectedActual} content1="proyecciones" content2="totalPagar" />
            <ParrafosCalculadora results={selectProyections} content1="proyecciones" content2="totalPagar" />
            <ParrafosCalculadora results={calcularDiferencia("proyecciones", "totalPagar")} />
          </div>
          <div className='result-concept'>
            <p>Costo total</p>
            <ParrafosCalculadora results={selectedActual} content1="proyecciones" content2="costoTotalEmpleador" />
            <ParrafosCalculadora results={selectProyections} content1="proyecciones" content2="costoTotalEmpleador" />
            <ParrafosCalculadora results={calcularDiferencia("proyecciones", "costoTotalEmpleador")} />
          </div>
        </div>
      </div>
      <h2>Trabajador</h2>
      <div className='content-tittle'>
        <h3>Concepto</h3>
        <h3>Actual</h3>
        <h3>Proyectado</h3>
        <h3>Diferencia</h3>
      </div>
      <div className='content-difference'>
        <div className='concept'>
          <div className='result-concept'>
            <p>Ingresos</p>
            <ParrafosCalculadora results={selectedActual} content1="calculations" content2="totalIngresos" />
            <ParrafosCalculadora results={selectProyections} content1="calculations" content2="totalIngresos" />
            <ParrafosCalculadora results={calcularDiferencia("calculations", "totalIngresos")} />
          </div>
          <div className='result-concept'>
            <p>Aportes</p>
            <ParrafosCalculadora results={selectedActual} content1="proyecciones" content2="aportesTrabajador" />
            <ParrafosCalculadora results={selectProyections} content1="proyecciones" content2="aportesTrabajador" />
            <ParrafosCalculadora results={calcularDiferencia("proyecciones", "aportesTrabajador")} />
          </div>
          <div className='result-concept'>
            <p>ReteFuente</p>
            <ParrafosCalculadora results={selectedActual} content1="calculations" content2="retencionFuente" />
            <ParrafosCalculadora results={selectProyections} content1="calculations" content2="retencionFuente" />
            <ParrafosCalculadora results={calcularDiferencia("calculations", "retencionFuente")} />
          </div>
          <div className='result-concept'>
            <p>Deducciones</p>
            <ParrafosCalculadora results={selectedActual} content1="proyecciones" content2="deducciones" />
            <ParrafosCalculadora results={selectProyections} content1="proyecciones" content2="deducciones" />
            <ParrafosCalculadora results={calcularDiferencia("proyecciones", "deducciones")} />
          </div>
          <div className='result-concept'>
            <p>Pago neto</p>
            <ParrafosCalculadora results={selectedActual} content1="proyecciones" content2="pagoNetoTrabajador" />
            <ParrafosCalculadora results={selectProyections} content1="proyecciones" content2="pagoNetoTrabajador" />
            <ParrafosCalculadora results={calcularDiferencia("proyecciones", "pagoNetoTrabajador")} />

          </div>
      
        </div>
      </div>

    </div>
  );
};

export default ResultDiference;