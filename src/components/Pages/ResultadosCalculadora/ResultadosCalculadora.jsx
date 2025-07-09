import React, { useEffect, useState } from "react";
import NavbarCalculadora from "../../Ui/NavbarCalculadora/NavbarCalculadora.jsx";
import Parrafos from "../../Ui/ParrafosCalculadora/ParrafosCalculadora.jsx";
import gomez from "../../../assets/Group 17.png";
import NotAvaible from "../../Ui/NoDisponible/NoDisponible.jsx";
import deleteIcon from '../../../assets/delete.png';
import ok from'../../../assets/ok.png';
import "../../../utils/GeneratePdf.css";
import donwload from '../../../assets/Download.png';
import GeneratePDF from "../../../utils/GeneratePdf";


const Resultados = () => {
  const [results, setResults] = useState([]); //Estado que almacena los resultados
  const [showAlert, setShowAlert] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedResults, setSelectedResults] = useState([]);
  console.log(results)

  useEffect(() => {
    const storedResults = localStorage.getItem("Resultados");
    if (storedResults) {
      setResults(JSON.parse(storedResults).reverse());
    }
  }, []);

  const handleDeleteResult = (index) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
    localStorage.setItem("Resultados", JSON.stringify(updatedResults));
    
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const openPDFModal = () => {
    setSelectedResults([]);
    setShowPDFModal(true);
  };

  const handleResultSelection = (result) => {
    const isSelected = selectedResults.includes(result);
    if (isSelected) {
      // Deselect if already selected
      setSelectedResults(selectedResults.filter(r => r !== result));
    } else {
      // Select or add to selection
      setSelectedResults([...selectedResults, result]);
    }
  };

  const generateSelectedPDFs = () => {
    if (selectedResults.length === 0) {
      alert("Selecciona al menos un resultado para generar PDF");
      return;
    }

    // Generate PDF for each selected result
    selectedResults.forEach(result => {
      const index = results.indexOf(result);
      GeneratePDF(`result-${index}`, `Resultado-${results.length - index}`);
    });

    // Close the modal
    setShowPDFModal(false);
  };

  

  return (
    <>
      {results.length > 0 ? (
        <div className="results-container">
          <div className="container-button">
            <NavbarCalculadora />
            {showPDFModal && (
              <div className="pdf-selection-modal">
                <div className="modal-content">
                  <h2>Selecciona para generar PDF</h2>
                  {results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`result-selection-item ${
                        selectedResults.includes(result) ? 'selected' : ''
                      }`}
                      onClick={() => handleResultSelection(result)}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedResults.includes(result)}
                        readOnly
                      />
                      <span>Resultado {results.length - index}</span>
                    </div>
                  ))}
                  <div className="modal-actions">
                    <button 
                      onClick={() => setShowPDFModal(false)}
                      className="cancel-button"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={generateSelectedPDFs}
                      className="generate-button"
                    >
                      Generar PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {showAlert && (
            <div className='alert'>
              <img src={ok} alt="icono" /> ¡Borrado con Exito!
            </div>
          )}
          {results.map((result, index) => (  
            <div key={index} id={`result-${index}`}>
              <h2>Resultado {results.length - index}</h2>
                  <div className="contentImg" data-html2canvas-ignore="true">
                    <button onClick={openPDFModal} className="generate-pdf-selector-button"><img src={donwload} />Generar PDF</button>
                  </div>
              <div className="results-grid">
                <div className="result-card">
                  <div className="delete-button" data-html2canvas-ignore="true">                                      
                    <button onClick={() => handleDeleteResult(index)} className="selector"><img src={deleteIcon}/></button>
                  </div>
                  <h2>Resumen de Datos</h2>
                  <div className="result">
                    <div className="childre">
                      <p>Tipo de Salario</p>
                      <p>Salario</p>
                      <p>Otros Pagos Salariales</p>
                      <p>Otros Pagos No Salariales</p>
                      <p>Retención en la Fuente</p>
                      <p>Deducciones</p>
                      <p>Pensionado</p>
                      <p>Exonerado</p>
                      <p>Clase de riesgo</p>
                      <p>Auxilio de transporte</p>
                    </div>
                    <div className="">
                      <Parrafos  results={result} content1="calculations" content2="tipoSalario"/>
                      <Parrafos  results={result} content1="calculations" content2="salario"/>
                      <Parrafos  results={result} content1="calculations" content2="otrosPagosSalariales"/>
                      <Parrafos  results={result} content1="calculations" content2="otrosPagosNoSalariales"/>
                      <Parrafos  results={result} content1="calculations" content2="retencionFuente"/>
                      <Parrafos  results={result} content1="calculations" content2="deducciones"/>
                      <Parrafos  results={result} content1="calculations" content2="pensionado"/>
                      <Parrafos  results={result} content1="calculations" content2="exonerado"/>
                      <Parrafos  results={result} content1="calculations" content2="claseRiesgo"/>
                      <Parrafos  results={result} content1="calculations" content2="auxilioDeTransporte"/>
                    </div>
                  </div>
                  <div className="gomezV">
                    <img src={gomez} alt="icono" />
                  </div>
                </div>

                <div className="result-card">
                  <h2>Proyecciones</h2>
                  <div className="content-proyecctions">
                    <div className="title">
                      <h3>Empleador</h3>
                      <h3>Trabajador</h3>
                    </div>
                    <div className="result">
                      <div className="employer-proyecctions">
                        <div className="box-employer">
                          <p>Provisiones</p>
                          <Parrafos results={result} content1="proyecciones" content2="provisionesPrestacionesSociales" />
                        </div>
                        <div className="box-employer">
                          <p>Aportes</p>
                          <Parrafos results={result} content1="proyecciones" content2="aportesEmpleador" />
                        </div>
                        <div className="box-employer">
                          <p>Pago neto</p>
                          <Parrafos results={result} content1="proyecciones" content2="pagoNetoTrabajador" />
                        </div>
                        <div className="box-employer">
                          <p>Total a pagar</p>
                          <Parrafos results={result} content1="proyecciones" content2="totalPagar" />
                        </div>
                        <div className="box-employer">
                          <p>Costo total</p>
                          <Parrafos results={result} content1="proyecciones" content2="costoTotalEmpleador" />
                        </div>
                      </div>
                      <div className="title2">
                        <h3>Trabajador</h3>
                      </div>
                      <div className="employee-proyecctions">
                        <div className="box-employee">
                          <p>Total Ingresos</p>
                          <Parrafos results={result} content1="calculations" content2="totalIngresos" />
                        </div>
                        <div className="box-employee">
                          <p>Aportes</p>
                          <Parrafos results={result} content1="proyecciones" content2="aportesTrabajador" />
                        </div>
                        <div className="box-employee">
                          <p>ReteFuente</p>
                          <Parrafos results={result} content1="calculations" content2="retencionFuente"/>
                        </div>
                        <div className="box-employee">
                          <p>Deducciones</p>
                          <Parrafos results={result} content1="proyecciones" content2="deducciones" />
                        </div>
                        <div className="box-employee">
                          <p>Pago Neto</p>
                          <Parrafos results={result} content1="proyecciones" content2="pagoNetoTrabajador" />
                        </div>
                      </div>            
                    </div>
                  </div>
                  <div className="gomezV">
                    <img src={gomez} alt="icono" />
                  </div>
                </div>

                <div className="result-parafiscales">
                  <h2>Seguridad Social y Parafiscales</h2>
                  <div className="box-parafiscales">
                    <div className="result-ibc">
                      <div className="content-ibc">
                        <span></span>
                        <div className="ibc-line">
                          <Parrafos content="IBCGeneral =" results={result} content1="seguridadSocial" content2="ibcGeneral"/>
                        </div>
                        <div className="ibc-line">
                          <Parrafos content="IBCPfiscales =" results={result} content1="seguridadSocial" content2="ibcParafiscales"/>
                        </div>
                      </div>
                      <div className="box-ibc">
                        <div className="salary">
                          <p>Salario</p>
                          <Parrafos results={result} content1="calculations" content2="salarioIntegral"/>
                        </div>
                        <span className="operator">+ <span >+</span></span>
                        <div className="salary">
                          <p>Otros <br /> Pagos <br /> Salariales</p>
                          <Parrafos results={result} content1="calculations" content2="otrosPagosSalariales"/>
                        </div>
                        <span className="operator" >+ <span >+</span></span>
                        <div className="salary">
                          <p>Excedente</p>
                          <Parrafos results={result} content1="seguridadSocial" content2="excedente" />
                        </div>
                      </div>
                    </div>
                    <div className="box-concepto">
                      <div className="title">
                        <h3>Concepto</h3>
                        <h3>Empleador</h3>
                        <h3>Trabajador</h3>
                      </div>
                      <div className="result">
                        <div className="">
                          <p>Salud</p>
                          <p>Pension</p>
                          <p>FSP</p>
                          <p>Riesgos</p>
                          <p>CCF</p>
                          <p>SENA</p>
                          <p>ICBF</p>
                          <p><b>Total</b></p>
                        </div>
                        <div>
                          <Parrafos  results={result} content1="seguridadSocial" content2="saludEmpleador"/>
                          <Parrafos  results={result} content1="seguridadSocial" content2="pensionEmpleador"/>
                          <Parrafos  results={result} />
                          <Parrafos  results={result} content1="seguridadSocial" content2="riesgosLaborales"/>
                          <Parrafos  results={result} content1="seguridadSocial" content2="cajaCompensacion"/>
                          <Parrafos  results={result} content1="seguridadSocial" content2="sena"/>
                          <Parrafos  results={result} content1="seguridadSocial" content2="icbf"/>
                          <Parrafos  results={result} content1="seguridadSocial" content2="totalEmpleador"/>
                        </div>
                        <div>
                          <Parrafos  results={result} content1="seguridadSocial" content2="saludTrabajador"/>
                          <Parrafos  results={result} content1="seguridadSocial" content2="pensionTrabajador"/>
                          <Parrafos  results={result} content1="seguridadSocial" content2="FSP"/>
                          <Parrafos  results={result} />
                          <Parrafos  results={result} />
                          <Parrafos  results={result} />
                          <Parrafos  results={result} />
                          <Parrafos  results={result} content1="seguridadSocial" content2="totalTrabajador"/>
                        </div>
                      </div>
                      <div className="gomezV">
                        <img src={gomez} alt="icono" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="result-card">
                  <h2>Prestaciones Sociales y Vacaciones</h2>
                  <div className="result">
                    <div className="children">
                      <p>Prima de Servicios:</p>
                      <p>Cesantías:</p>
                      <p>Intereses Cesantias:</p>
                      <p>Vacaciones:</p>
                    </div>
                    <div className="children2">
                      <Parrafos  results={result} content1="prestacionesSociales" content2="primaServicios"/>
                      <Parrafos  results={result} content1="prestacionesSociales" content2="cesantias"/>
                      <Parrafos  results={result} content1="prestacionesSociales" content2="interesesCesantias"/>
                      <Parrafos  results={result} content1="prestacionesSociales" content2="vacaciones"/>
                    </div>
                  </div>
                  <div className="gomezV">
                    <img src={gomez} alt="icono" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <NotAvaible />
        </div>
      )}
    </>
  );
};

export default Resultados;