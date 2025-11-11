import { useState, useEffect } from "react";
import { resumenNominaFetch } from "../../../Services/UseFetchResumenNomina"
import { toast } from "react-toastify"
import "./ResumenNomina.css"
import Filtros from "../../Ui/Filtros/Filtros";
import { turnosFetch } from "../../../Services/useFetchTurnos";


function ResumenNomina() {
  const [resumen, setResumen] = useState([]);
  const [generarResumen, setGenerarResumen] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    apellido: "",
    area: "",
    cc: "",
    diaInicio: "",
    diaFin: ""
  });


  const campos = [
    { nombre: "nombre", tipo: "text", placeholder: "Nombre" },
    { nombre: "apellido", tipo: "text", placeholder: "Apellido" },
    { nombre: "area", tipo: "text", placeholder: "Área" },
    { nombre: "cc", tipo: "text", placeholder: "Documento" },
    { nombre: "diaInicio", tipo: "date", placeholder: "Día inicio" },
    { nombre: "diaFin", tipo: "date", placeholder: "Día fin" },
  ];

  const cargarResumen = async (filtrosOpcionales = {}) => {
    try {
      const data = await resumenNominaFetch.listar(filtrosOpcionales);
      setResumen(data)
    } catch (error) {
      toast.error(error)
      console.error(error)

    }
  }


  const generar = async () => {
    try {
      const data = await resumenNominaFetch.generar();
      setGenerarResumen(data);
    } catch (error) {
      toast.error(error)
      console.error(error)
    }
  }

  useEffect(() => {
    cargarResumen();
    generar();
  }, [])

  return (
    <>
      <section className="resumen-nomina-container">
        <div className="btn-imprimir-resumen">
          <button onClick={() => window.print()}>Generar PDF</button>
          <Filtros
            titulo="Filtros"
            campos={campos}
            filtros={filtros}
            setFiltros={setFiltros}
            onAplicar={(f) => cargarResumen(f)}
            onLimpiar={() => {
              const vacios = {
                nombre: "",
                apellido: "",
                area: "",
                cc: "",
                diaInicio: "",
                diaFin: "",
              };
              setFiltros(vacios)
              cargarResumen({})
            }}
          />
        </div>

        <table border={1} cellPadding={4} className="resumen-nomina-table">
          <thead>
            <tr>
              <th rowSpan={2}>Trabajador</th>
              <th rowSpan={2}>N° Documento</th>
              <th rowSpan={2}>Área</th>
              <th colSpan={8}>Horas</th>
              <th colSpan={8}>Valores</th>
            </tr>
            <tr>
              <th>Total trabajadas</th>
              <th>Extras diurnas</th>
              <th>Extras nocturnas</th>
              <th>Extras festivas diurnas</th>
              <th>Extras festivas nocturnas </th>
              <th>Recargo nocturno</th>
              <th>Recargo festivo</th>
              <th>Recargo festivo nocturno</th>
              <th>Valor extras</th>
              <th>Valor extras festivas</th>
              <th>Recargo nocturno</th>
              <th>Recargo festivo</th>
              <th>Recargo festivo nocturno</th>
              <th>Neto a pagar</th>
              <th>Costo total</th>
            </tr>
          </thead>
          <tbody>
            {resumen.length > 0 ? (
              resumen.map((emp) => (
                <tr key={emp.Trabajador.id}>
                  <td>{emp.Trabajador.nombre} {emp.Trabajador.apellido}</td>
                  <td>{emp.Trabajador.cc}</td>
                  <td>{emp.Trabajador.area}</td>
                  <td>{emp.totalHoras}</td>
                  <td>{emp.horasExtraOrdinaria}</td>
                  <td>{emp.horasExtraNocturna}</td>
                  <td>{emp.horasExtraOrdinariaDominical}</td>
                  <td>{emp.horasExtraNocturnaDominical}</td>
                  <td>{emp.horasRecargoNocturno}</td>
                  <td>{emp.horasRecargoDominical}</td>
                  <td>{emp.horasRecargoNocturnoDominical}</td>
                  <td>${emp.valorExtraOrdinaria + emp.valorExtraNocturna}</td>
                  <td>${(emp.valorExtraOrdinariaDominical + emp.valorExtraNocturnaDominical).toLocaleString("es-CO", { maximumFractionDigits: 0 })}</td>
                  <td>${emp.valorRecargoNocturno}</td>
                  <td>${emp.valorRecargoDominical}</td>
                  <td>${emp.valorRecargoNocturnoDominical}</td>
                  <td><b>${emp.netoAPagar}</b></td>
                  <td><b>${emp.costoTotal}</b></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="18" className="no-trabajadores">
                  <p>No hay resultados disponibles.</p>
                  <span>Modifica los filtros o agrega trabajadores y turnos para visualizar el resumen de nómina aquí.</span>
                </td>
              </tr>
            )}
          </tbody>
          {resumen.length > 0 && (
            <tfoot>
              <tr style={{ background: "#f8fafc", fontWeight: "bold" }}>
                <td colSpan={3}>Totales</td>
                <td>
                  {resumen.reduce((sum, emp) => sum + Number(emp.totalHoras), 0)}
                </td>
                <td>
                  {resumen.reduce((sum, emp) => sum + Number(emp.horasExtraOrdinaria || 0), 0)}
                </td>
                <td>
                  {resumen.reduce((sum, emp) => sum + Number(emp.horasExtraNocturna || 0), 0)}
                </td>
                <td>
                  {resumen.reduce((sum, emp) => sum + Number(emp.horasExtraOrdinariaDominical || 0), 0)}
                </td>
                <td>
                  {resumen.reduce((sum, emp) => sum + Number(emp.horasExtrasNocturnaominical || 0), 0)}
                </td>
                <td>
                  {resumen.reduce((sum, emp) => sum + Number(emp.horasRecargoNocturno || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                </td>
                <td>
                  {resumen.reduce((sum, emp) => sum + Number(emp.horasRecargoDominical || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                </td>
                <td>
                  {resumen.reduce((sum, emp) => sum + Number(emp.horasRecargoNocturnoDominical || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                </td>
                <td>$
                  {resumen.reduce((sum, emp) => sum + Number(emp.valorExtraOrdinaria + emp.valorExtraNocturna || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                </td>
                <td>$
                  {resumen.reduce((sum, emp) => sum + Number(emp.valorExtraOrdinariaDominical + emp.valorExtraNocturnaDominical || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                </td>
                <td>$
                  {resumen.reduce((sum, emp) => sum + Number(emp.valorRecargoNocturno || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                </td>
                <td>$
                  {resumen.reduce((sum, emp) => sum + Number(emp.valorRecargoDominical || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                </td>
                <td>$
                  {resumen.reduce((sum, emp) => sum + Number(emp.valorRecargoNocturnoDominical || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                </td>
                <td>
                  <b>${resumen.reduce((sum, emp) => sum + Number(emp.netoAPagar || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}</b>
                </td>
                <td>
                  <b>${resumen.reduce((sum, emp) => sum + Number(emp.costoTotal || 0), 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}</b>
                </td>
              </tr>
            </tfoot>
          )}
        </table>

      </section>

    </>
  )
}

export default ResumenNomina;


