import React, { useEffect, useState } from "react";
import TrabajadorForm from "../../Ui/TrabajadoresForm/TrabajadoresForm";
import TrabajadorMasivoUpload from "../../Ui/TrabajadoresMasivosUpload/TrabajadoresMasivosUpload";
import TrabajadorList from "../../Ui/ListaTrabajadores/ListaTrabajadores";
import { trabajadorService } from "../../../Services/api";
import { toast } from "react-toastify";
import "./AgregarEmpleado.css";

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([]);

  const cargar = async () => {
    try {
      const data = await trabajadorService.listar();
      setTrabajadores(data);
    } catch (err) {
      toast.error(`Error al cargar trabajadores: ${err.message}`);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleAdd = async (data) => {
    try {
      await trabajadorService.crear(data);
      toast.success("Trabajador agregado con éxito");
      cargar();
    } catch (err) {
      toast.error(`Error al agregar trabajador: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleUpload = async (file) => {
    try {
      await trabajadorService.cargaMasiva(file);
      toast.success("Empleados cargados con éxito");
      cargar();
    } catch (err) {
      toast.error(`Error en carga masiva: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleEdit = async (id, data) => {
    try {
      await trabajadorService.editar(id, data);
      toast.success("Trabajador editado correctamente");
      cargar();
    } catch (err) {
      toast.error(`Error al editar trabajador: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await trabajadorService.eliminar(id);
      toast.success("Trabajador eliminado con éxito");
      cargar();
    } catch (err) {
      toast.error(`Error al eliminar trabajador: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="trabajadores-page">
      <TrabajadorForm onSubmit={handleAdd} />
      <TrabajadorMasivoUpload onUpload={handleUpload} />
      <TrabajadorList
        trabajadores={trabajadores}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
