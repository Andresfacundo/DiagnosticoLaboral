import React, { useState } from "react";
import { toast } from "react-toastify";
import { trabajadorService } from "../../../Services/api"; 
import "./TrabajadorMasivoUpload.css";

export default function TrabajadorMasivoUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Por favor selecciona un archivo Excel");
      return;
    }

    try {
      await onUpload(file);
      setFile(null);
      e.target.reset();
    } catch (err) {
      toast.error(`Error en la carga: ${err.message}`);
    }
  };

  const handleDownloadPlantilla = async () => {
    try {
      await trabajadorService.descargarPlantilla();      
      toast.success("Plantilla descargada correctamente");
    } catch (err) {
      toast.error(`Error al descargar plantilla: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-upload">  
    <span>Selecciona un archivo Excel (.xlsx) para carga masiva de trabajadores</span>      
      <input 
        type="file" 
        accept=".xlsx,.xls" 
        onChange={(e) => setFile(e.target.files[0])} 
      />

      <div className="btn-container">
        <button type="submit" className="btn-upload">
          Subir Excel
        </button>

        <button 
          type="button" 
          className="btn-descargar" 
          onClick={handleDownloadPlantilla}
        >
          Descargar plantilla
        </button>
      </div>
    </form>
  );
}
