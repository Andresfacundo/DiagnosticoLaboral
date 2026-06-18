import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./TurnoModal.css";
import { calcularHoras } from "../../../utils/calcularHoras"

const DIAS_SEMANA = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export default function TurnoModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  trabajadores,
  turnoInicial,
}) {
  const [form, setForm] = useState(turnoInicial || { diasRepeticion: [] });
  const [horasTrabajadas, setHorasTrabajadas] = useState(0)

  useEffect(() => {
    if (turnoInicial) {
      setForm({
        ...turnoInicial,
        diasRepeticion: turnoInicial.diasRepeticion || [],
      });
    }
  }, [turnoInicial]);

  useEffect(() => {
    if (form.horaInicio && form.horaFin) {
      const resultado = calcularHoras(form.horaInicio, form.horaFin, form.minutosDescanso);
      setHorasTrabajadas(resultado);
    }
  }, [form.horaInicio, form.horaFin, form.minutosDescanso]);
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (dia) => {
    setForm((prev) => {
      const dias = prev.diasRepeticion || [];
      if (dias.includes(dia)) {
        return { ...prev, diasRepeticion: dias.filter((d) => d !== dia) };
      } else {
        return { ...prev, diasRepeticion: [...dias, dia] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const handleDelete = () => {
    if (window.confirm("¿Seguro que deseas eliminar este turno?")) {
      onDelete(form.id);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* 🔹 Título dinámico */}
        <h2>{form.isNew ? "Crear Turno" : "Editar Turno"}</h2>

        <form onSubmit={handleSubmit} className="form-modal-calendario">
          <label>
            Trabajador:
            <select
              name="trabajadorId"
              value={form.trabajadorId || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione trabajador</option>
              {trabajadores.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Día Inicio:
            <input
              type="date"
              name="diaInicio"
              value={form.diaInicio || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Día Fin:
            <input
              type="date"
              name="diaFin"
              value={form.diaFin || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Hora Inicio:
            <input
              type="time"
              name="horaInicio"
              value={form.horaInicio || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Hora Fin:
            <input
              type="time"
              name="horaFin"
              value={form.horaFin || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Minutos Descanso:
            <input
              type="number"
              name="minutosDescanso"
              value={form.minutosDescanso}
              onChange={handleChange}

            />
          </label>

          <label>
            Hora Inicio Descanso:
            <input
              type="time"
              name="inicioDescanso"
              value={form.inicioDescanso || ""}
              onChange={handleChange}
            />
          </label>
          <div className="horas-trabajadas">
            <p>Horas trabajadas:</p>
            <span style={{
              color: horasTrabajadas.totalHoras <= 11 ? "green"  : "red",
              
            }}> {horasTrabajadas.horas}h {horasTrabajadas.minutos}min</span>
          </div>

          <div className="dias-repeticion">
            <p>Repetir turno:</p>
            <div className="checkbox-group">
              {DIAS_SEMANA.map((dia) => (
                <label key={dia} className="checkbox-dia">
                  <input
                    type="checkbox"
                    checked={form.diasRepeticion?.includes(dia)}
                    onChange={() => handleCheckboxChange(dia)}
                  />
                  <span>{dia.charAt(0).toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions-turnos">
            <button type="submit">
              {form.isNew ? "Crear" : "Guardar Cambios"}
            </button>

            {!form.isNew && (
              <button
                type="button"
                className="btn-delete"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            )}

            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
