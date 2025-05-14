import React, { useState, useEffect } from "react";
import Navbar from "../../UI/Navbar/Navbar";
import "./Comparar.css";
import gomez from "../../../assets/Group 17.png";
import ResumenComparativo from "../../UI/Comparative/ResumenComparativo";
import ResultDiference from "../../Layouts/ResultDifference/ResultDiference";
import GeneratePDF from "../../../utils/GeneratePdf";
import download from "../../../assets/Download.png"


const Comparar = () => {
  const [results, setResults] = useState([]); // Estado que almacena los resultados
  const [selectedActual, setSelectedActual] = useState(null);
  const [selectProyections, setSelectProyecctions] = useState(null);

  useEffect(() => {
    const storedResults = localStorage.getItem("Resultados");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  const handleSelectChange = (event, type) => {
    const selectIndex = parseInt(event.target.value, 10);
    if (selectIndex >= 0) {
      const selectResult = results[selectIndex];
      if (type === "actual") {
        setSelectedActual(selectResult);
      } else {
        setSelectProyecctions(selectResult);
      }
    } else {
      if (type === "actual") setSelectedActual(null);
      if (type === "proyectado") setSelectProyecctions(null);
    }
  };


  return (
    <div className="box-navbar">
      <h1>Comparación</h1>
      <div className="content-navbar">
        <Navbar />
      </div>
      <div className="content-card" id="pdfContent">
        <div className="content-compare" >
          <div className="box-select-compare" data-html2canvas-ignore="true">
            <div className="contentImg" data-html2canvas-ignore="true">
              <button onClick={() => GeneratePDF("pdfContent", "comparacion")} className="generate-pdf-selector-button"><img src={download} />Generar PDF</button>
            </div>
            <h3>Actual</h3>
            <select
              className="box-input"
              onChange={(e) => handleSelectChange(e, "actual")}
            >
              <option value="-1">--Seleccione--</option>
              {results.map((_, index) => (
                <option key={index} value={index}>
                  Resultado {index + 1}
                </option>
              ))}
            </select> 
          </div>
          <div className="box-select-compare" data-html2canvas-ignore="true">
            <h3>Proyectado</h3>
            <select
              className="box-input"
              onChange={(e) => handleSelectChange(e, "proyectado")}
            >
              <option value="-1">--Seleccione--</option>
              {results.map((_, index) => (
                <option key={index} value={index}>
                  Resultado {index + 1}
                </option>
              ))}
            </select>            
          </div>

          <div className="result-proyecction">
            <ResultDiference selectedActual={selectedActual} selectProyections={selectProyections} />
            <div className="gomezV">
              <img src={gomez} alt="icono" />
            </div>
          </div>
        </div>
        <div className="content-graphic">
          <div className="">
            <ResumenComparativo  selectProyections={selectProyections}selectedActual={selectedActual} />
          
          </div>
          <div className="gomezV">
              <img src={gomez} alt="icono" />
            </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default Comparar;